INSERT INTO ships (name, speed, size, max_cargo_size)
VALUES ($1, $2, $3, $4)
RETURNING ship_id;
