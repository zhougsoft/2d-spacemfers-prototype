UPDATE player_location
SET system_id = 1,
    arrival_time = NOW()
WHERE player_id = 1;
