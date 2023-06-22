import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
dotenv.config();

const PORT = process.env.PORT;
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

app.use("/api/v1/user", userRoutes);

mongoose
  .connect(MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server listening to the port : ${PORT}`)
    )
  )
  .catch((error) => console.log(error.message))
  .finally(() => console.log("Mongo DB Connection Successful"));
