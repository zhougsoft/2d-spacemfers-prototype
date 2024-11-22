WITH deleted_player AS (
    DELETE FROM players
    WHERE player_id = $1
    RETURNING player_id
)

DELETE FROM player_active_ship
WHERE player_id = (SELECT player_id FROM deleted_player);

DELETE FROM player_location
WHERE player_id = (SELECT player_id FROM deleted_player);

SELECT player_id FROM deleted_player;
