const express = require("express");

function createCitiesRouter(db) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const sql = "SELECT city_id, city_name, country FROM cities ORDER BY city_name ASC";

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Query error:", err.message);
        return res.status(500).json({ error: "Database query failed." });
      }
      return res.json(results);
    });
  });

  return router;
}

module.exports = createCitiesRouter;
