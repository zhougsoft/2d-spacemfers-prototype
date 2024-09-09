INSERT INTO planets (system_id, name)
VALUES ($1, $2)
RETURNING planet_id;
