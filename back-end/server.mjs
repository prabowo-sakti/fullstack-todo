import express from "express";
import bodyParser from "body-parser";
import * as whisper from "./stores/whisper.mjs";
import * as user from "./stores/user.mjs";
import cors from "cors";
import { generateToken, requireAuthentication } from "./utils.js";

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends APIError {
  constructor(message = "Resource not Found") {
    super(message, 404);
  }
}

class BadRequestError extends APIError {
  constructor(message = "Invalid request parameters") {
    super(message, 400);
  }
}

class ForbiddenError extends APIError {
  constructor(
    message = "You do not have permissission to access this resource"
  ) {
    super(message, 403);
  }
}

class AuthenticationError extends APIError {
  constructor(message = "Authentication failed") {
    super(message, 401);
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
    if (!username || !password || !email) {
      throw new BadRequestError("Username, password, and email are required");
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
      throw new NotFoundError("Any whispers not found");
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
      throw new NotFoundError("Any Whispers not found");
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
      if (whispers.length <= 0) {
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
      if (storedWhisper <= 0) {
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

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    console.log(`[NOT FOUND] ${req.method} ${req.originalUrl} `);

    if (req.originalUrl.startsWith("/api/")) {
      return res.status(404).json({
        statusCode: 404,
        errorStatus: "Resource not found",
        message: err.message,
        path: req.originalUrl,
      });
    }

    return res.status(404).render("error", {
      title: "404 Not Found",
      message: err.message,
      statusCode: 404,
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof BadRequestError) {
    console.log(`[Bad Request] ${req.method},${req.originalUrl}, `);
  }
});
export { app };
