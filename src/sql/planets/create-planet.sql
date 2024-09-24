WITH new_location AS (
    INSERT INTO locations (location_type_id)
    VALUES (1)
    RETURNING location_id
), new_planet AS (
    INSERT INTO planets (location_id, system_id, name)
    VALUES ((SELECT location_id FROM new_location), $1, $2)
    RETURNING planet_id
)
SELECT 
    (SELECT planet_id FROM new_planet) AS planet_id,
    (SELECT location_id FROM new_location) AS location_id;
