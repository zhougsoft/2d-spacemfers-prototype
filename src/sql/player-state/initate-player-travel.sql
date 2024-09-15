UPDATE player_location
SET 
    prev_location_id = CASE 
                            WHEN arrival_time IS NULL OR arrival_time <= NOW() THEN target_location_id 
                            ELSE prev_location_id 
                       END,
    target_location_id = $2,
    departure_time = NOW(),
    arrival_time = NOW() + INTERVAL '1 minute'
WHERE player_id = $1
RETURNING *;
