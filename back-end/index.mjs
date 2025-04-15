import { app } from "./server.mjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupGlobalErrorHandlers } from "./errorHandlers.mjs";
dotenv.config();

setupGlobalErrorHandlers();

setTimeout(() => {
  console.log("Memicu uncaughtException untuk pengujian");
  throw new Error("Test uncaughtException error");
}, 10000);

setTimeout(() => {
  console.log("Memicu unhandledRejection untuk pengujian");
  Promise.reject(new Error("Test unhandledRejection error"));
}, 15000);

const port = process.env.PORT;
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Terhubung ke mongodb");
  app.listen(port, () => {
    console.log(`Running in http://localhost:${port}`);
  });
} catch (err) {
  console.log(err);
}
