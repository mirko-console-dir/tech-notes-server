const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // only origin in the allowedOrigins or not origin that is for test with postman
      callback(null, true);
    } else {
      callback(new Error("Not allow by cors"));
    }
  },
  credentials: true, // Access Allow Credentials Header  => handle header for us in auto
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
