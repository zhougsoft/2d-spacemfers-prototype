WITH valid_station AS (
    SELECT 1
    FROM station_info
    WHERE celestial_id = $3
),
insert_ship AS (
    INSERT INTO player_ships (player_id, ship_type_id, station_celestial_id)
    SELECT $1, $2, $3
    FROM valid_station
    RETURNING player_ship_id
)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM insert_ship) THEN (SELECT player_ship_id FROM insert_ship)
        ELSE NULL
    END AS player_ship_id,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM valid_station) THEN 'invalid_station'
        WHEN EXISTS (SELECT 1 FROM insert_ship) THEN 'success'
        ELSE 'unknown_failure'
    END AS status;
