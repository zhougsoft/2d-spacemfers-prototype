INSERT INTO player_ships (player_id, ship_id, condition, station_id)
VALUES ($1, $2, $3, $4)
RETURNING player_ship_id;
