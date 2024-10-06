SELECT celestials.*, station_info.* 
FROM celestials
LEFT JOIN station_info ON celestials.celestial_id = station_info.celestial_id
WHERE celestials.celestial_id = $1;
