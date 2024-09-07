UPDATE player_location
SET system_id = $2,
    arrival_time = NOW()
WHERE player_id = $1;
