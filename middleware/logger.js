const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`; // t is from regex indicate a table (usefull if i want to use in a excel file)

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      // if there is not the folder create it
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (e) {
    console.error(e);
  }
};

const logger = (req, res, next) => {
  // log any req that comes (we should put some condition like we should create the log only if is not coming from our url or for only specific methods)
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`); // usefull in development
  next(); // moves to the next piece of middleware, or eventually the controller where the req is process
};

module.exports = { logEvents, logger }; // we export logEvents because maybe we want to use to handle error events in some error handler
