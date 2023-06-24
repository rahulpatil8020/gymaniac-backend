const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
