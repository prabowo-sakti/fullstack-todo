import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { checkPasswordStreng } from "./utils";

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
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username must be at most 20 characters long"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Pasword must be at least 8 characters long"],
    validate: {
      validator: checkPasswordStreng,
      prop
    },
  },
});

const whisperSchema = new mongoose.Schema({
  message: String,
  completed: Boolean,
});

const Whisper = mongoose.model("Whisper", whisperSchema);

export { Whisper };
