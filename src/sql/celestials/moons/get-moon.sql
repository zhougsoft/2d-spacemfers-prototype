SELECT celestials.*, moon_info.* 
FROM celestials
LEFT JOIN moon_info ON celestials.celestial_id = moon_info.celestial_id
WHERE celestials.celestial_id = $1;
