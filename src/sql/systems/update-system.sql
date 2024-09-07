UPDATE systems
SET name = $2
WHERE system_id = $1
RETURNING *;
