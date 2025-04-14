// File ini digunakan untuk
// untuk membantu tugas-tugas function dari file lain, agar tidak menuliskan kode berulang kali pada fiile lain.

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticationError } from "./server.mjs";
dotenv.config();

export function checkPasswordStrength(password) {
  const strengthRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  return strengthRegex.test(password);
}

export function generateToken(data) {
  return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "24h" });
}

export function requireAuthentication(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new AuthenticationError("Sesi kamu tidak valid");
    }
    const accessToken = token.split(" ")[1];
    if (!accessToken) {
      throw new AuthenticationError("Informasi login tidak valid");
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded.data;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new AuthenticationError(
          "Sesi kamu sudah kadaluarsa, silahkan login kembali"
        );
      } else if (err.name === "JsonWebTokenError") {
        throw new AuthenticationError("Informasi login kamu tidak valid, ");
      } else {
        throw new AuthenticationError("Informasi login kamu tidak valid");
      }
    }
  } catch (error) {
    next(error);
  }
}
