-- delete a player and their associated records
WITH deleted_player AS (
    DELETE FROM player_active_ship
    WHERE player_id = 1
    RETURNING player_id
)
DELETE FROM players
WHERE player_id = (SELECT player_id FROM deleted_player);
