import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./modules/users/userRoutes.js";
import parkingLocationRoutes from "./modules/parkingLocations/parkingLocationRoutes.js";

const app = express();

app.use(
  cors(),
  express.urlencoded({ extended: true }),
  express.json({ extended: true })
);

app.use("/users", userRoutes);
app.use("/parkingLocations", parkingLocationRoutes);

dotenv.config();
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const URI = process.env.MONGO_URL;
mongoose
  .connect(URI)
  .then(console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Test");
});

app.listen("5000", () => {
  console.log("listening on port 5000");
});
