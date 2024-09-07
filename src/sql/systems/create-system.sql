INSERT INTO systems (name)
VALUES ($1)
RETURNING system_id;
