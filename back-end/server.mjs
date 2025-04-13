import express from "express";
import bodyParser from "body-parser";
import * as whisper from "./stores/whisper.mjs";
import * as user from "./stores/user.mjs";
import cors from "cors";
import { generateToken, requireAuthentication } from "./utils.js";
import { validateUsername } from "./validation.js";

class APIError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.code =
      code || this.constructor.name.replace(/Error$/, "").toUpperCase();
  }
}

class NotFoundError extends APIError {
  constructor(message = "Resource not Found") {
    super(message, 404, "RESOURCE_NOT_FOUND");
  }
}

class BadRequestError extends APIError {
  constructor(
    message = "Invalid request parameters",
    statusCode = 400,
    code = "BAD_REQUEST"
  ) {
    super(message, statusCode, code);
  }
}

class ValidationError extends BadRequestError {
  constructor(message = "Validasi data gagal", allErrors = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.allErrors = allErrors;
  }
}

class ForbiddenError extends APIError {
  constructor(message = "You do not have permission to access this resource") {
    super(message, 403, "FORBIDDEN_ACCESS");
  }
}

class AuthenticationError extends APIError {
  constructor(message = "Authentication failed") {
    super(message, 401, "UNAUTHORIZED");
  }
}
const corsOptions = {
  origin: "http://localhost:5173", // Ganti dengan origin frontend Anda
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/logout", (req, res) => {
  res.redirect("/login");
});

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequestError("Username and password are required");
    }
    const foundUser = await user.getUserByCredentials(username, password);
    const accessToken = generateToken({ username, id: foundUser._id });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});
app.post("/signup", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      throw new ValidationError(`Username validation failed`, [
        { field: "username", message: usernameValidation.message },
      ]);
    }
    const newUser = await user.create(username, password, email);
    const accessToken = generateToken({ username, id: newUser._id });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

app.get("/about", async (req, res, next) => {
  try {
    const whispers = await whisper.getAll();
    if (whispers.length <= 0) {
      throw new NotFoundError("Upps, tidak ada whisper yang ditemukan satupun");
    }
    res.render("about", { whispers });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/whisper", requireAuthentication, async (req, res, next) => {
  try {
    const whispers = await whisper.getAll();
    if (whispers.length <= 0) {
      throw new NotFoundError("Upps, tidak ada whisper yang ditemukan satupun");
    }
    res.json(whispers);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/api/v1/whisper/:id",
  requireAuthentication,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const whispers = await whisper.getById(id);
      if (!whispers) {
        throw new NotFoundError(`Whisper with ID: ${id} is not found`);
      }
      res.json(whispers);
    } catch (error) {
      next(error);
    }
  }
);

app.post("/api/v1/whisper", requireAuthentication, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      throw new BadRequestError("Tasks wajib diisi");
    }
    const newWhisper = await whisper.create(message, req.user.id);
    res.status(201).json(newWhisper);
  } catch (error) {
    next(error);
  }
});

app.put(
  "/api/v1/whisper/:id",
  requireAuthentication,
  async (req, res, next) => {
    try {
      const { message } = req.body;
      const id = req.params.id;

      if (!message) {
        throw new BadRequestError("Masukkan tasks yang valid");
      }

      const storedWhisper = await whisper.getById(id);
      if (!storedWhisper) {
        throw new NotFoundError(`Whisper dengan ID: ${id} tidak ditemukan`);
      }

      if (storedWhisper.author.id !== req.user.id) {
        throw new ForbiddenError(
          "Anda tidak memiliki izin untuk mengedit whisper ini"
        );
      }

      await whisper.updateById(id, message);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  "/api/v1/whisper/:id",
  requireAuthentication,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const storedWhisper = await whisper.getById(id);

      if (storedWhisper.length <= 0) {
        throw new NotFoundError(`Whisper dengan ID: ${id} tidak ditemukan`);
      }
      if (storedWhisper.author.id !== req.user.id) {
        throw new ForbiddenError(
          "Anda tidak memiliki izin untuk menghapus whisper ini"
        );
      }
      await whisper.deleteById(id);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

// 1. Error handler unutuk menangani error tidak menemukan whisper
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(404).json({
        succes: false,
        error: {
          statusCode: err.statusCode,
          code: err.code,
          message: err.message,
        },
        timestamp: new Date().toISOString(),
        pathUrl: req.originalUrl,
      });
    }

    return res.status(404).render("error", {
      title: "404 Not Found",
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      success: false,
      error: {
        statusCode: err.statusCode,
        code: err.code,
        message: err.message,
      },
      timestamp: new Date().toISOString(),
      pathUrl: req.originalUrl,
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        statusCode: err.statusCode,
        code: err.code,
        message: err.message,
        allErrors: err.allErrors,
      },
      timestamp: new Date().toISOString(),
      pathUrl: req.originalUrl,
    });
  }
  next(err);
});

// Handler untuk BadRequestError DITEMPATKAN SETELAHNYA
app.use((err, req, res, next) => {
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      success: false,
      error: {
        statusCode: err.statusCode,
        code: err.code,
        message: err.message,
      },
      timestamp: new Date().toISOString(),
      pathUrl: req.originalUrl,
    });
  }
  next(err);
});

export { app };
