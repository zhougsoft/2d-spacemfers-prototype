SELECT celestials.*, planet_info.* 
FROM celestials
LEFT JOIN planet_info ON celestials.celestial_id = planet_info.celestial_id
WHERE celestials.celestial_id = $1;
