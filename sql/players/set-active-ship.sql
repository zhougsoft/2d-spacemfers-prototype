-- update the player's active ship
UPDATE player_active_ship
SET player_ship_id = 0
WHERE player_id = 0;
