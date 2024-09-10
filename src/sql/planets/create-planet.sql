WITH new_planet AS (
    INSERT INTO planets (system_id, name)
    VALUES ($1, $2)
    RETURNING planet_id
), new_location AS (
    INSERT INTO locations (location_type_id, location_entity_id)
    VALUES (1, (SELECT planet_id FROM new_planet))
    RETURNING location_id
)
SELECT 
    (SELECT planet_id FROM new_planet) AS planet_id,
    (SELECT location_id FROM new_location) AS location_id;
