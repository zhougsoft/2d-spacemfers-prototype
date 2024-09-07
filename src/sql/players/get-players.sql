-- get players by their ids
SELECT * FROM players WHERE player_id IN ($1);
