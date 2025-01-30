import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { checkPasswordStreng } from "./utils.js";

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
    },
  },

  emai: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    select: false,
    required: [true, "Email is required"],

    validate: {
      validator: validator.isEmail,
      message: "Email is not valid",
    },
  },
});

const whisperSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

whisperSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

userSchema.pre("save", async function (next) {
  const user = this
  if(user.isModified('username')) {
    const salt = await bcrypt.genSalt()
    
  }
});

const Whisper = mongoose.model("Whisper", whisperSchema);

export { Whisper };
