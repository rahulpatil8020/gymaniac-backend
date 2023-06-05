import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
dotenv.config();

PORT = process.env.PORT;
MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

app.use("/api/v1/user", () => {});

mongoose
  .connect(MONGO_CONNECTION_URL, {
    useNewUrlParserP: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server listening to the port : ${PORT}`)
    )
  )
  .catch((error) => console.log(error.message))
  .finally(() => console.log("Mongo DB Connection Successful"));
