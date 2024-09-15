WITH new_player AS (
    INSERT INTO players DEFAULT VALUES
    RETURNING player_id
),
player_location AS (
    INSERT INTO player_location
    (player_id, target_location_id, prev_location_id, departure_time, arrival_time)
    SELECT player_id, 
           NULL,
           NULL,
           NULL,
           NULL
    FROM new_player
    ON CONFLICT (player_id) DO NOTHING
),
active_ship AS (
    INSERT INTO player_active_ship (player_id, player_ship_id)
    SELECT player_id, NULL
    FROM new_player
    ON CONFLICT (player_id) DO NOTHING
)
SELECT * FROM new_player;
