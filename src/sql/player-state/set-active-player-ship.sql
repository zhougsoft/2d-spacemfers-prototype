WITH active_ship AS (
  UPDATE player_active_ship
  SET player_ship_id = $2
  WHERE player_id = $1
  RETURNING player_ship_id
)
UPDATE player_ships
SET station_celestial_id = NULL
WHERE player_ship_id = (SELECT player_ship_id FROM active_ship);
