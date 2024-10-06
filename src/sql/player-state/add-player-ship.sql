WITH valid_station AS (
    SELECT 1 
    FROM station_info 
    WHERE celestial_id = $3
)
INSERT INTO player_ships (player_id, ship_type_id, station_celestial_id)
SELECT $1, $2, $3
FROM valid_station
RETURNING player_ship_id;
