import { app } from "./server.mjs";
import mongoose from "mongoose";

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
