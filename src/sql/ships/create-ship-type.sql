INSERT INTO ship_types (name, speed, size, max_cargo_size)
VALUES ($1, $2, $3, $4)
RETURNING ship_type_id;
