-- $1 = planet_id
-- $2 = name
-- $3 = distance_from_planet_km
WITH planet_info AS (
    SELECT location_id,
        system_id
    FROM planets
    WHERE planet_id = $1
),
planet_location AS (
    SELECT distance_from_star_au
    FROM locations
    WHERE location_id = (
            SELECT location_id
            FROM planet_info
        )
),
new_location AS (
    INSERT INTO locations (
            location_type_id,
            system_id,
            distance_from_star_au,
            distance_from_planet_km
        )
    VALUES (
            2,
            (
                SELECT system_id
                FROM planet_info
            ),
            (
                SELECT distance_from_star_au
                FROM planet_location
            ),
            $3
        )
    RETURNING location_id
),
new_station AS (
    INSERT INTO stations (location_id, planet_id, name)
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
FROM new_station;