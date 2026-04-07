const mysql = require("mysql2");

function createDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "uts_trip_tracking",
  });
}

function connectDb(db) {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  createDbConnection,
  connectDb,
};

// Password for local mysql instance is process.env.DB_PASSWORD var.
// User used during development is root.
// Database is called uts_trip_tracking.
