const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user.js");
const rootRoute = require("./routes/root.js");

const app = express();

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", rootRoute);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
dotenv.config();

const PORT = process.env.PORT;
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

app.use("/api/v1/user", userRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

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
