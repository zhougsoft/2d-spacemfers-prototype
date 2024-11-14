UPDATE player_location
SET prev_celestial_id = CASE
    WHEN arrival_time IS NULL
    OR arrival_time <= EXTRACT(EPOCH FROM NOW()) THEN target_celestial_id
    ELSE prev_celestial_id
  END,
  target_celestial_id = $2,
  departure_time = EXTRACT(EPOCH FROM NOW()),
  arrival_time = CASE 
    WHEN $3 <= 0 THEN NULL
    ELSE EXTRACT(EPOCH FROM NOW()) + $3
  END
WHERE player_id = $1
  AND $3 > 0
  AND EXISTS (
    SELECT 1
    FROM player_active_ship
    WHERE player_active_ship.player_id = $1
      AND player_active_ship.player_ship_id IS NOT NULL
  )
RETURNING *;
