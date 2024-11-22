WITH RECURSIVE celestial_hierarchy AS (
    SELECT celestial_id, parent_celestial_id, celestial_id AS original_id
    FROM celestials
    
    UNION ALL
    
    SELECT c.celestial_id, c.parent_celestial_id, ch.original_id
    FROM celestials c
    JOIN celestial_hierarchy ch ON c.celestial_id = ch.parent_celestial_id
)
SELECT c.*, 
       (SELECT celestial_id 
        FROM celestial_hierarchy ch 
        WHERE ch.original_id = c.celestial_id 
        AND ch.parent_celestial_id IS NULL) AS root_celestial_id
FROM celestials c;
