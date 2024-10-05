UPDATE player_location
SET 
    prev_celestial_id = target_celestial_id,
    target_celestial_id = $2,
    arrival_time = NOW()
WHERE player_id = $1;
