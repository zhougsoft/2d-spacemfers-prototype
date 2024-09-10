-- create a new player and initialize their state records
WITH new_player AS (
    -- create a new player & return the id
    INSERT INTO players DEFAULT VALUES
    RETURNING player_id
),
active_ship AS (
    -- initialize player active ship state record
    INSERT INTO player_active_ship (player_id, player_ship_id)
    SELECT player_id, NULL
    FROM new_player
    ON CONFLICT (player_id) DO NOTHING
),
player_location AS (
    -- initialize player location state record
    INSERT INTO player_location (player_id, location_id, arrival_time)
    SELECT player_id, 
           NULL,
           NOW() as arrival_time
    FROM new_player
    ON CONFLICT (player_id) DO NOTHING
)
-- return newly created player
SELECT * FROM new_player;
