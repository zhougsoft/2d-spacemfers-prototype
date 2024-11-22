WITH RECURSIVE total_distances AS (
  SELECT celestial_id,
    parent_celestial_id,
    distance_from_parent AS total_distance
  FROM celestials
  WHERE celestial_id IN ($1, $2)
  UNION ALL
  SELECT celestials.celestial_id,
    celestials.parent_celestial_id,
    total_distances.total_distance + celestials.distance_from_parent
  FROM celestials
    JOIN total_distances ON celestials.celestial_id = total_distances.parent_celestial_id
)
SELECT GREATEST(MAX(total_distance), MIN(total_distance)) - LEAST(MAX(total_distance), MIN(total_distance)) AS distance
FROM total_distances
WHERE parent_celestial_id IS NULL;
