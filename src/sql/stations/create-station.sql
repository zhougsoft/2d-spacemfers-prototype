INSERT INTO stations (planet_id, name)
VALUES ($1, $2)
RETURNING station_id;
