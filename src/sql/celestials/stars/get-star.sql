SELECT celestials.*, star_info.* 
FROM celestials
LEFT JOIN star_info ON celestials.celestial_id = star_info.celestial_id
WHERE celestials.celestial_id = $1;
