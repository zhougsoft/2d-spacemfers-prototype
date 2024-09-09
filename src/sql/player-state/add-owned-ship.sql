INSERT INTO player_ships (player_id, ship_id, condition)
VALUES ($1, $2, $3)
RETURNING player_ship_id;
