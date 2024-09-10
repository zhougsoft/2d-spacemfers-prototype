WITH new_station AS (
    INSERT INTO stations (planet_id, name)
    VALUES ($1, $2)
    RETURNING station_id
), new_location AS (
    INSERT INTO locations (location_type_id, location_entity_id)
    VALUES (2, (SELECT station_id FROM new_station))
    RETURNING location_id
)
SELECT 
    (SELECT station_id FROM new_station) AS station_id,
    (SELECT location_id FROM new_location) AS location_id;
