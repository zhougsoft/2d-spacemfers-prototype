SELECT celestials.*, belt_info.* 
FROM celestials
LEFT JOIN belt_info ON celestials.celestial_id = belt_info.celestial_id
WHERE celestials.celestial_id = $1;
