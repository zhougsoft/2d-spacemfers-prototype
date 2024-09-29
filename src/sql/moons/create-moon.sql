WITH new_location AS (
    INSERT INTO locations (location_type_id)
    VALUES (3)
    RETURNING location_id
), new_moon AS (
    INSERT INTO moons (location_id, planet_id, name)
    VALUES ((SELECT location_id FROM new_location), $1, $2)
    RETURNING moon_id
)
SELECT 
    (SELECT moon_id FROM new_moon) AS moon_id,
    (SELECT location_id FROM new_location) AS location_id;
