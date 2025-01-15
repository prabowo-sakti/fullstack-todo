import express from "express";
import bodyParser from "body-parser";
import { getAll, getById, create, updateById, deleteById } from "./store.mjs";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:5173", // Ganti dengan origin frontend Anda
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/about", async (req, res) => {
  const whispers = await getAll();

  res.render("about", { whispers });
});

app.get("/api/v1/whisper", async (req, res) => {
  const whispers = await getAll();
  res.json(whispers);
});

app.get("/api/v1/whisper/:id", async (req, res) => {
  const id = req.params.id;
  const whispers = await getById(id);
  if (!whispers) {
    res.sendStatus(404);
  } else {
    res.json(whispers);
  }
});

app.post("/api/v1/whisper", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.sendStatus(400);
  } else {
    const whisper = await create(message);
    res.status(201).json(whisper);
  }
});

app.put("/api/v1/whisper/:id", async (req, res) => {
  const { message } = req.body;
  const id = req.params.id;

  if (!message) {
    res.sendStatus(400);
    return;
  }

  const whisper = await getById(id);
  if (!whisper) {
    res.sendStatus(400);
  } else {
    await updateById(id, message);
    res.sendStatus(200);
  }
});

app.delete("/api/v1/whisper/:id", async (req, res) => {
  const id = req.params.id;
  const whisper = await getById(id);

  if (!whisper) {
    res.sendStatus(404);
    return;
  }
  await deleteById(id);
  res.sendStatus(200);
});

export { app };
