SELECT players.*, player_location.*, player_active_ship.*
FROM players
LEFT JOIN player_location ON players.player_id = player_location.player_id
LEFT JOIN player_active_ship ON players.player_id = player_active_ship.player_id
WHERE players.player_id = ANY($1);
