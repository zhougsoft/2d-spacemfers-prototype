UPDATE ships
SET name = $2, size = $3, max_cargo_size = $4
WHERE ship_id = $1
RETURNING *;
