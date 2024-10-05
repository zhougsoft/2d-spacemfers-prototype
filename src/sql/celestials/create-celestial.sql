INSERT INTO celestials (name, celestial_type_id, parent_celestial_id, distance_from_parent)
VALUES ($1, $2, $3, $4)
RETURNING celestial_id;
