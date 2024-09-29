WITH new_location AS (
    INSERT INTO locations (location_type_id)
    VALUES (4)
    RETURNING location_id
), new_belt AS (
    INSERT INTO belts (location_id, planet_id, name)
    VALUES ((SELECT location_id FROM new_location), $1, $2)
    RETURNING belt_id
)
SELECT 
    (SELECT belt_id FROM new_belt) AS belt_id,
    (SELECT location_id FROM new_location) AS location_id;
