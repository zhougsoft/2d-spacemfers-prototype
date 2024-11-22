WITH new_celestial AS (
  INSERT INTO celestials (name, celestial_type_id, parent_celestial_id, distance_from_parent)
  VALUES ($1, 5, $2, $3)
  RETURNING celestial_id
),
new_station AS (
  INSERT INTO station_info (celestial_id)
  SELECT celestial_id FROM new_celestial
)
SELECT celestial_id FROM new_celestial;
