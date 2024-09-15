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
  AND EXISTS (
    SELECT 1 
    FROM player_active_ship 
    WHERE player_active_ship.player_id = $1
      AND player_active_ship.player_ship_id IS NOT NULL
  )
RETURNING *;
