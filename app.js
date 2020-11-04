const express = require("express");
const morgan = require("morgan");
const ExpressError = require("./helpers/express-error");
const usersRouter = require("./routes/users");
const mostFreqRouter = require("./routes/most-frequent");

const app = express();

// add logging
app.use(morgan("tiny"));

// routes
app.use(usersRouter);
app.use(mostFreqRouter);

/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});


/** general error handler */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack || err.message);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;