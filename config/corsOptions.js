const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// corsOptions.allowedHeaders = ["Authorization", "Content-Type"]; // Add the necessary headers here
// corsOptions.methods = ["GET", "POST", "PUT", "DELETE"];

module.exports = corsOptions;
