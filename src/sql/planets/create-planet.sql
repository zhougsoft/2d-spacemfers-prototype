-- $1 = system_id
-- $2 = name
-- $3 = distance_from_star_au
WITH new_location AS (
    INSERT INTO locations (
            location_type_id,
            system_id,
            distance_from_star_au,
            distance_from_planet_km
        )
    VALUES (1, $1, $3, 0)
    RETURNING location_id
),
new_planet AS (
    INSERT INTO planets (location_id, system_id, name)
    VALUES (
            (
                SELECT location_id
                FROM new_location
            ),
            $1,
            $2
        )
    RETURNING *
)
SELECT *
FROM new_planet;