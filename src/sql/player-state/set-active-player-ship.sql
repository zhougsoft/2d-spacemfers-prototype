WITH current_player_location AS (
    SELECT target_celestial_id
    FROM player_location
    WHERE player_id = $1
),
has_valid_station_location AS (
    SELECT si.celestial_id
    FROM station_info si
    JOIN current_player_location pcl ON si.celestial_id = pcl.target_celestial_id
),
has_current_active_ship AS (
    SELECT pas.player_ship_id
    FROM player_active_ship pas
    WHERE pas.player_id = $1
),
update_previous_ship_location AS (
    UPDATE player_ships
    SET station_celestial_id = (SELECT celestial_id FROM has_valid_station_location)
    WHERE player_ship_id = (SELECT player_ship_id FROM has_current_active_ship)
    AND EXISTS (SELECT 1 FROM has_current_active_ship)
    AND EXISTS (SELECT 1 FROM has_valid_station_location)
    RETURNING player_ship_id
),
update_new_active_ship_location AS (
    UPDATE player_ships
    SET station_celestial_id = NULL -- set to NULL to indicate it's the active ship (location is inferred by player location)
    WHERE player_ship_id = $2
    AND EXISTS (SELECT 1 FROM has_valid_station_location)
    RETURNING player_ship_id
),
set_new_active_ship AS (
    UPDATE player_active_ship
    SET player_ship_id = $2
    WHERE player_id = $1
    AND EXISTS (SELECT 1 FROM update_new_active_ship_location)
    RETURNING player_ship_id
)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM set_new_active_ship) THEN (SELECT player_ship_id FROM set_new_active_ship)
        ELSE NULL
    END AS updated_ship_id,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM has_valid_station_location) THEN 'invalid_location'
        WHEN EXISTS (SELECT 1 FROM set_new_active_ship) THEN 'success'
        ELSE 'unknown_failure'
    END AS status;
