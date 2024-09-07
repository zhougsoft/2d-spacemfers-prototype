UPDATE player_active_ship
SET player_ship_id = $2
WHERE player_id = $1;
