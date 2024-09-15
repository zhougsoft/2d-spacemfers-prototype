UPDATE player_location
SET 
    prev_location_id = target_location_id,
    target_location_id = $2,
    arrival_time = NOW()
WHERE player_id = $1;
