import express from "express";
import bodyParser from "body-parser";
import * as whisper from "./stores/whisper.mjs";
import * as user from "./stores/user.mjs";
import cors from "cors";
import { generateToken, requireAuthentication } from "./utils.js";

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

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await user.getUserByCredentials(username, password);
    const accessToken = generateToken({ username, id: foundUser._id });
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = await user.create(username, password, email);
    const accessToken = generateToken({ username, id: newUser._id });
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ kesalahan: err.message });
  }
});

app.get("/about", async (req, res) => {
  const whispers = await whisper.getAll();

  res.render("about", { whispers });
});

app.get("/api/v1/whisper", requireAuthentication, async (req, res) => {
  const whispers = await whisper.getAll();
  res.json(whispers);
});

app.get("/api/v1/whisper/:id", requireAuthentication, async (req, res) => {
  const id = req.params.id;
  const whispers = await whisper.getById(id);
  if (!whispers) {
    res.sendStatus(404);
  } else {
    res.json(whispers);
  }
});

app.post("/api/v1/whisper", requireAuthentication, async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.sendStatus(400);
  } else {
    const newWhisper = await whisper.create(message);
    res.status(201).json(newWhisper);
  }
});

app.put("/api/v1/whisper/:id", requireAuthentication, async (req, res) => {
  const { message } = req.body;
  console.log(req.params);
  const id = req.params.id;

  if (!message) {
    res.sendStatus(400);
    return;
  }

  const storedWhisper = await getById(id);
  if (!storedWhisper) {
    res.sendStatus(400);
  } else {
    await whisper.updateById(id, message);
    res.sendStatus(200);
  }
});

app.delete("/api/v1/whisper/:id", requireAuthentication, async (req, res) => {
  const id = req.params.id;
  const storedWhisper = await whisper.getById(id);

  if (!storedWhisper) {
    res.sendStatus(404);
    return;
  }
  await deleteById(id);
  res.sendStatus(200);
});

export { app };
