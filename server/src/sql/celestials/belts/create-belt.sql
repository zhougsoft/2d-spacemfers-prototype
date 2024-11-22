WITH new_celestial AS (
  INSERT INTO celestials (name, celestial_type_id, parent_celestial_id, distance_from_parent)
  VALUES ($1, 4, $2, $3)
  RETURNING celestial_id
),
new_belt AS (
  INSERT INTO belt_info (celestial_id)
  SELECT celestial_id FROM new_celestial
)
SELECT celestial_id FROM new_celestial;
