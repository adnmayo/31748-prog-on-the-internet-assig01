const express = require("express");
const path = require("path");

const createCitiesRouter = require("./routes/cities");
const createBookingsRouter = require("./routes/bookings");

function createApp(db) {
  const app = express();

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.json());

  app.use("/api/cities", createCitiesRouter(db));
  app.use("/api/bookings", createBookingsRouter(db));

  return app;
}

module.exports = createApp;
