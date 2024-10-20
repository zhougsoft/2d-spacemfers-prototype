# spacemfers

> mfers, in space

![spacemfers](assets/spacemfers.png)

### what is spacemfers

spacemfers is a web-based, open-universe, idle-clicker, lofi space sandbox MMO inspired by EVE Online.

#### MVP game loop:
Players gather resources and sell them in a dynamic market to earn currency, then use those earnings to purchase fuel, which is required to travel to new locations and gather more resources. The market prices fluctuate based on supply and demand, creating strategic decisions about when to buy fuel or sell resources. Players must balance resource collection, fuel management, and market opportunities to optimize their progress and accumulate wealth.

### database tables

each table in the spacemfers game database

#### celestial_types
represents the types of celestial bodies (e.g., stars, planets, moons).

- celestial_type_id (pk)
- name

#### celestials
represents celestial bodies (e.g., stars, planets, moons) in the game universe.

- celestial_id (pk)
- name
- celestial_type_id (fk celestial_types)
- parent_celestial_id (fk celestials, nullable)
- distance_from_parent (in AU, 0 if no parent)

#### star_info
additional information about stars.

- celestial_id (pk, fk celestials)

#### planet_info
additional information about planets.

- celestial_id (pk, fk celestials)

#### moon_info
additional information about moons.

- celestial_id (pk, fk celestials)

#### belt_info
additional information about asteroid belts.

- celestial_id (pk, fk celestials)

#### station_info
additional information about space stations.

- celestial_id (pk, fk celestials)

#### ship_types
represents the different types of spaceships in the game.

- ship_type_id (pk)
- name
- speed
- size
- max_cargo_size

#### items
the items in the game that can be owned by a player.

- item_id (pk)
- name
- size

#### players
the players in the game.

- player_id (pk)

#### player_location
represents the location of the player in the universe.

- player_id (pk, fk players)
- target_celestial_id (fk celestials)
- prev_celestial_id (fk celestials, nullable)
- departure_time (nullable)
- arrival_time (nullable)

#### player_ships
represents ships owned by a player.

- player_ship_id (pk)
- player_id (fk players)
- ship_type_id (fk ship_types)
- station_celestial_id (fk station_info, nullable)

#### player_active_ship
represents a player's active ship (can only be one at a time).

- player_id (pk, fk players)
- player_ship_id (fk player_ships, unique)

#### player_ship_inventory
represents the items in a player's ship inventory.

- player_ship_id (fk player_ships)
- item_id (fk items)
- amount

#### player_station_inventory
represents the player's items stored in space stations.

- player_id (fk players)
- station_celestial_id (fk station_info)
- item_id (fk items)
- amount
