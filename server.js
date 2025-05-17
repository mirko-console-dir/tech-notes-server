const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3500;

app.use(logger);
app.use(cors);
app.use(express.json()); // this allow to receive and parese json data
app.use(cookieParser); // we can parse cookies that we can use

// express.static is a build in middleware that is relative path where is the server.js file
// say to express where to find static files that we will use in the serve like images, css etc...
app.use("/", express.static(path.join(__dirname, "public"))); // __dirname = global var that node understand and look on the folder we are in

app.use("/", require("./routes/root"));

// this is trigger when ther is no route for the request
app.all(
  "/{*splat}", // everything reach app.all will be put throw this, * means all => is the catch all that goes at the end
  (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      // if there is a json req
      res.json({ message: "404 not found" });
    } else {
      res.type("txt").send("404 Not Found"); // if html or json is not match in the acceprs header
    }
  }
);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));
