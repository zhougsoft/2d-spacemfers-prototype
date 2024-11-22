WITH RECURSIVE celestial_hierarchy AS (
    SELECT c.celestial_id, c.parent_celestial_id
    FROM celestials c
    WHERE c.celestial_id = $1
    
    UNION ALL
    
    SELECT c.celestial_id, c.parent_celestial_id
    FROM celestials c
    JOIN celestial_hierarchy ch ON c.celestial_id = ch.parent_celestial_id
)
SELECT *, 
       (SELECT celestial_id 
        FROM celestial_hierarchy 
        WHERE parent_celestial_id IS NULL) AS root_celestial_id
FROM celestials
WHERE celestial_id = $1;
