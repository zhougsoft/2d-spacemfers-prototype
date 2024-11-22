WITH new_celestial AS (
  INSERT INTO celestials (name, celestial_type_id, parent_celestial_id, distance_from_parent)
  VALUES ($1, 1, NULL, 0)
  RETURNING celestial_id
),
new_star AS (
  INSERT INTO star_info (celestial_id)
  SELECT celestial_id FROM new_celestial
)
SELECT celestial_id FROM new_celestial;
