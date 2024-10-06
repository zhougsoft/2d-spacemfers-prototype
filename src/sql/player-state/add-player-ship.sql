INSERT INTO player_ships (player_id, ship_type_id, station_celestial_id)
VALUES ($1, $2, $3)
RETURNING player_ship_id;
