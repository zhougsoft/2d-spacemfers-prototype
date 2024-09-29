WITH new_location AS (
    INSERT INTO locations (location_type_id)
    VALUES (3)
    RETURNING location_id
), new_moon AS (
    INSERT INTO moons (location_id, planet_id, name)
    VALUES ((SELECT location_id FROM new_location), $1, $2)
    RETURNING *
)
SELECT * FROM new_moon;
