-- create a new player and initialize their active ship as NULL
WITH new_player AS (
    INSERT INTO players DEFAULT VALUES
    RETURNING player_id
)
INSERT INTO player_active_ship (player_id, player_ship_id)
SELECT player_id, NULL
FROM new_player
RETURNING player_id;
