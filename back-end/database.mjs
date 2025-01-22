import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
  },
});

const whisperSchema = new mongoose.Schema({
  message: String,
  completed: Boolean,
});

const Whisper = mongoose.model("Whisper", whisperSchema);

export { Whisper };
