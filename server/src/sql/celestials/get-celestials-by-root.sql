WITH RECURSIVE celestial_hierarchy AS (
    SELECT c.*
    FROM celestials c
    WHERE c.celestial_id = $1
    
    UNION ALL
    
    SELECT c.*
    FROM celestials c
    JOIN celestial_hierarchy ch ON c.parent_celestial_id = ch.celestial_id
)
SELECT * 
FROM celestial_hierarchy
WHERE celestial_id != $1;
