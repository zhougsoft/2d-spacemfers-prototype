WITH player_current_location AS (
    SELECT target_celestial_id
    FROM player_location
    WHERE player_id = $1
),
ship_location AS (
    SELECT station_celestial_id
    FROM player_ships
    WHERE player_ship_id = $2
),
valid_ship_selection AS (
    SELECT 1
    FROM player_current_location, ship_location
    WHERE player_current_location.target_celestial_id = ship_location.station_celestial_id
),
update_ship AS (
    UPDATE player_active_ship
    SET player_ship_id = $2
    WHERE player_id = $1
    AND EXISTS (SELECT 1 FROM valid_ship_selection)
    RETURNING player_ship_id
)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM update_ship) THEN (SELECT player_ship_id FROM update_ship)
        ELSE NULL
    END AS updated_ship_id,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM valid_ship_selection) THEN 'invalid_location'
        WHEN EXISTS (SELECT 1 FROM update_ship) THEN 'success'
        ELSE 'unknown_failure'
    END AS status;
