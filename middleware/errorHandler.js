const { logEvents } = require("./logger");

// the following will overwrite the degault express error handler

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errorLog.log"
  );

  console.info(err.stack); // a lot of usefull info

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);
  res.json({ message: err.message });
};

module.exports = errorHandler;
