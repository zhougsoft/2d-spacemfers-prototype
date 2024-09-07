INSERT INTO ships (name, size, max_cargo_size)
VALUES ($1, $2, $3)
RETURNING ship_id;
