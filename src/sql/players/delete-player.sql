-- delete a player and their associated state records

WITH deleted_player AS (
    -- delete the player and return the id
    DELETE FROM players
    WHERE player_id = $1
    RETURNING player_id
)

-- delete player active ship state record
DELETE FROM player_active_ship
WHERE player_id = (SELECT player_id FROM deleted_player);

-- delete player location state record
DELETE FROM player_location
WHERE player_id = (SELECT player_id FROM deleted_player);

-- return deleted player id
SELECT player_id FROM deleted_player;
