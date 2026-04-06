const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // PASSWORD FOR MYSQL
  database: "uts_trip_tracking",
});

db.connect((err) => {
  if (err) {
    console.error("Could not connect to MySQL:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// API: get cities
app.get("/api/cities", (req, res) => {
  const sql = "SELECT city_id, city_name, country FROM cities ORDER BY city_name ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Query error:", err.message);
      return res.status(500).json({ error: "Database query failed." });
    }
    res.json(results);
  });
});

// API: get trips
app.get("/api/bookings", (req, res) => {
  const sql = `
    SELECT
      t.trip_id,
      t.airline_reference,
      c_origin.city_name AS origin_city,
      c_dest.city_name AS destination_city,
      t.departure_date AS date_of_departure,
      t.departure_time,
      t.seats_booked
    FROM trips t
    JOIN cities c_origin ON t.origin_id = c_origin.city_id
    JOIN cities c_dest ON t.destination_id = c_dest.city_id
    ORDER BY t.departure_date ASC, t.departure_time ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Query error:", err.message);
      return res.status(500).json({ error: "Database query failed." });
    }
    res.json(results);
  });
});

// API: add trip
app.post("/api/bookings", (req, res) => {
  const {
    airline_reference,
    origin_id,
    destination_id,
    departure_date,
    departure_time,
    seats_booked,
  } = req.body || {};

  const numericOriginId = Number(origin_id);
  const numericDestinationId = Number(destination_id);
  const numericSeatsBooked = Number(seats_booked);

  if (
    !airline_reference ||
    !numericOriginId ||
    !numericDestinationId ||
    !departure_date ||
    !departure_time ||
    !Number.isInteger(numericSeatsBooked) ||
    numericSeatsBooked < 1 ||
    numericOriginId === numericDestinationId
  ) {
    return res.status(400).json({ error: "Invalid trip data." });
  }

  const sql = `
    INSERT INTO trips
      (airline_reference, origin_id, destination_id, departure_date, departure_time, seats_booked)
    VALUES
      (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      airline_reference,
      numericOriginId,
      numericDestinationId,
      departure_date,
      departure_time,
      numericSeatsBooked,
    ],
    (err) => {
      if (err) {
        console.error("Query error:", err.message);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Airline reference already exists." });
        }

        return res.status(500).json({ error: "Database query failed." });
      }

      res.status(201).json({ message: "Trip added." });
    }
  );
});

// API: delete trip
app.delete("/api/bookings/:tripId", (req, res) => {
  const tripId = Number(req.params.tripId);

  if (!Number.isInteger(tripId) || tripId < 1) {
    return res.status(400).json({ error: "Invalid trip id." });
  }

  const sql = "DELETE FROM trips WHERE trip_id = ?";

  db.query(sql, [tripId], (err, result) => {
    if (err) {
      console.error("Query error:", err.message);
      return res.status(500).json({ error: "Database query failed." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Trip not found." });
    }

    res.status(200).json({ message: "Trip deleted." });
  });
});

// API: edit trip
app.put("/api/bookings/:tripId", (req, res) => {
  const tripId = Number(req.params.tripId);
  const {
    airline_reference,
    origin_id,
    destination_id,
    departure_date,
    departure_time,
    seats_booked,
  } = req.body || {};

  const numericOriginId = Number(origin_id);
  const numericDestinationId = Number(destination_id);
  const numericSeatsBooked = Number(seats_booked);

  if (
    !Number.isInteger(tripId) ||
    tripId < 1 ||
    !airline_reference ||
    !numericOriginId ||
    !numericDestinationId ||
    !departure_date ||
    !departure_time ||
    !Number.isInteger(numericSeatsBooked) ||
    numericSeatsBooked < 1 ||
    numericOriginId === numericDestinationId
  ) {
    return res.status(400).json({ error: "Invalid trip data." });
  }

  const sql = `
    UPDATE trips
    SET airline_reference = ?,
        origin_id = ?,
        destination_id = ?,
        departure_date = ?,
        departure_time = ?,
        seats_booked = ?
    WHERE trip_id = ?
  `;

  db.query(
    sql,
    [
      airline_reference,
      numericOriginId,
      numericDestinationId,
      departure_date,
      departure_time,
      numericSeatsBooked,
      tripId,
    ],
    (err, result) => {
      if (err) {
        console.error("Query error:", err.message);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Airline reference already exists." });
        }

        return res.status(500).json({ error: "Database query failed." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Trip not found." });
      }

      res.status(200).json({ message: "Trip updated." });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
