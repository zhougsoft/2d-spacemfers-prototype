DROP TRIGGER IF EXISTS enforce_star_type ON star_info;
DROP TRIGGER IF EXISTS enforce_planet_type ON planet_info;
DROP TRIGGER IF EXISTS enforce_moon_type ON moon_info;
DROP TRIGGER IF EXISTS enforce_belt_type ON belt_info;
DROP TRIGGER IF EXISTS enforce_station_type ON station_info;

DROP FUNCTION IF EXISTS enforce_celestial_type();

DROP INDEX IF EXISTS idx_celestials_celestial_type_id;
DROP INDEX IF EXISTS idx_celestials_celestial_parent_id;
DROP INDEX IF EXISTS idx_player_location_target_celestial_id;
DROP INDEX IF EXISTS idx_player_location_prev_celestial_id;
DROP INDEX IF EXISTS idx_player_location_departure_time;
DROP INDEX IF EXISTS idx_player_location_arrival_time;
DROP INDEX IF EXISTS idx_player_ships_player_id;
DROP INDEX IF EXISTS idx_player_ships_station_id;
DROP INDEX IF EXISTS idx_player_ship_inventory_player_ship_id;
DROP INDEX IF EXISTS idx_player_station_inventory_player_id;
DROP INDEX IF EXISTS idx_player_station_inventory_station_id;

DROP TABLE IF EXISTS player_station_inventory;
DROP TABLE IF EXISTS player_ship_inventory;
DROP TABLE IF EXISTS player_active_ship;
DROP TABLE IF EXISTS player_ships;
DROP TABLE IF EXISTS player_location;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS ship_types;
DROP TABLE IF EXISTS station_info;
DROP TABLE IF EXISTS belt_info;
DROP TABLE IF EXISTS moon_info;
DROP TABLE IF EXISTS planet_info;
DROP TABLE IF EXISTS star_info;
DROP TABLE IF EXISTS celestials;
DROP TABLE IF EXISTS celestial_types;
