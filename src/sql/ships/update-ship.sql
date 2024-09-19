UPDATE ships
SET name = $2, speed = $3, size = $4, max_cargo_size = $5
WHERE ship_id = $1
RETURNING *;
