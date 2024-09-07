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
    INSERT INTO player_location (player_id, system_id, station_id, arrival_time, last_docked)
    SELECT player_id, 
           NULL,
           NULL,
           NOW() as arrival_time,
           NULL as last_docked
    FROM new_player
    ON CONFLICT (player_id) DO NOTHING
)
-- return newly created player id
SELECT player_id FROM new_player;
