WITH current_player_location AS (
    SELECT pl.target_celestial_id
    FROM player_location pl
    JOIN station_info si ON pl.target_celestial_id = si.celestial_id  -- Ensure it's a station
    WHERE pl.player_id = $1
),
has_current_active_ship AS (
    SELECT pas.player_ship_id
    FROM player_active_ship pas
    WHERE pas.player_id = $1
),
update_active_ship_location AS (
    UPDATE player_ships
    SET station_celestial_id = (SELECT target_celestial_id FROM current_player_location)
    WHERE player_ship_id = (SELECT player_ship_id FROM has_current_active_ship)
    RETURNING player_ship_id
),
unset_active_ship AS (
    UPDATE player_active_ship
    SET player_ship_id = NULL
    WHERE player_id = $1
    AND EXISTS (SELECT 1 FROM update_active_ship_location)  -- ensure the previously active ship's location was updated
    RETURNING player_id
)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM unset_active_ship) THEN 'success'
        WHEN NOT EXISTS (SELECT 1 FROM current_player_location) THEN 'invalid_location'
        WHEN NOT EXISTS (SELECT 1 FROM has_current_active_ship) THEN 'no_active_ship'
        ELSE 'unknown_failure'
    END AS status;
