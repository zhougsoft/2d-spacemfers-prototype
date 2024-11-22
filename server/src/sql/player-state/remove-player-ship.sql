WITH removed_ship AS (
  DELETE FROM player_ships
  WHERE player_ship_id = $1
  RETURNING player_id, player_ship_id
)
UPDATE player_active_ship
SET player_ship_id = NULL
WHERE player_id = (SELECT player_id FROM removed_ship)
AND player_ship_id = (SELECT player_ship_id FROM removed_ship);
