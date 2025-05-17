const express = require("express");
const router = express.Router();
const path = require("path");

router.get(
  ["/", "/index", "/index.html"], // "^/$|/index(.html)?"regex is not suported anymore for DOS security reason so we need an array of routes in this case
  (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html")); // return the following path
  }
);

module.exports = router;
