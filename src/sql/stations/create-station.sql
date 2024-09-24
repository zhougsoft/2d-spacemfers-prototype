WITH new_location AS (
    INSERT INTO locations (location_type_id)
    VALUES (2)
    RETURNING location_id
), new_station AS (
    INSERT INTO stations (location_id, planet_id, name)
    VALUES ((SELECT location_id FROM new_location), $1, $2)
    RETURNING station_id
)
SELECT 
    (SELECT station_id FROM new_station) AS station_id,
    (SELECT location_id FROM new_location) AS location_id;
