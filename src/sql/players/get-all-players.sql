SELECT players.*, player_location.*, player_active_ship.player_ship_id AS active_ship_id
FROM players
LEFT JOIN player_location ON players.player_id = player_location.player_id
LEFT JOIN player_active_ship ON players.player_id = player_active_ship.player_id;
