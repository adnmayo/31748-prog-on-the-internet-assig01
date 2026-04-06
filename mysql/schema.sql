
CREATE DATABASE IF NOT EXISTS uts_trip_tracking;
USE uts_trip_tracking;

DROP VIEW IF EXISTS added_trips_view;

-- Cities
CREATE TABLE IF NOT EXISTS cities (
    city_id   INT          NOT NULL AUTO_INCREMENT,
    city_name VARCHAR(100) NOT NULL,
    country   VARCHAR(100) NOT NULL DEFAULT 'Australia',
    PRIMARY KEY (city_id)
);

INSERT IGNORE INTO cities (city_name, country) VALUES
    ('Sydney',      'Australia'),
    ('Melbourne',   'Australia'),
    ('Brisbane',    'Australia'),
    ('Perth',       'Australia'),
    ('Adelaide',    'Australia'),
    ('Canberra',    'Australia'),
    ('Gold Coast',  'Australia'),
    ('Hobart',      'Australia');

-- Trips
DROP TABLE IF EXISTS trips;
CREATE TABLE IF NOT EXISTS trips (
    trip_id        INT           NOT NULL AUTO_INCREMENT,
    airline_reference VARCHAR(30) NOT NULL,
    origin_id      INT           NOT NULL,
    destination_id INT           NOT NULL,
    departure_date DATE          NOT NULL,
    departure_time TIME          NOT NULL,
    seats_booked   INT           NOT NULL,
    PRIMARY KEY (trip_id),
    UNIQUE KEY unique_airline_reference (airline_reference),
    FOREIGN KEY (origin_id)      REFERENCES cities(city_id),
    FOREIGN KEY (destination_id) REFERENCES cities(city_id),
    CHECK (origin_id <> destination_id),
    CHECK (seats_booked >= 1)
);

-- added_trips_view
CREATE OR REPLACE VIEW added_trips_view AS
    SELECT
        t.airline_reference                         AS airline_reference,
        c_origin.city_name                          AS origin_city,
        c_dest.city_name                            AS destination_city,
        t.departure_date                            AS date_of_departure,
        t.departure_time                            AS departure_time,
        t.seats_booked                              AS seats_booked
    FROM trips      t
    JOIN cities     c_origin ON t.origin_id         = c_origin.city_id
    JOIN cities     c_dest   ON t.destination_id    = c_dest.city_id;
