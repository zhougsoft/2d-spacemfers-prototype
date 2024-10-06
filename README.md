# spacemfers

> mfers, in space

![spacemfers](assets/spacemfers.png)

### what is spacemfers

spacemfers is a web-based, open-universe, idle-clicker, lofi space sandbox MMO inspired by EVE Online.

#### MVP game loop:
Players gather resources and sell them in a dynamic market to earn currency, then use those earnings to purchase fuel, which is required to travel to new locations and gather more resources. The market prices fluctuate based on supply and demand, creating strategic decisions about when to buy fuel or sell resources. Players must balance resource collection, fuel management, and market opportunities to optimize their progress and accumulate wealth.


### database tables

each table in the spacemfers game database

#### systems
represents solar systems in the universe, the parent element of all locations players can travel

- system_id (pk)
- name

#### location_types
types of locations in the game universe that can be found in systems

- location_type_id (pk)
- name (unique)

#### locations
represents specific locations within the game universe

- location_id (pk)
- location_type_id (fk location_types)
- system_id (fk systems)
- distance_from_star_au (applicable to planets or other future star orbital bodies)
- distance_from_planet_km (applicable to stations, moons, belts or other future planet orbital bodies)

#### planets
the planets that orbit the star of a solar system

- planet_id (pk)
- system_id (fk systems)
- location_id (fk locations)
- name

#### stations
space stations that orbit planets where players can store items & do business

- station_celestial_id (pk)
- planet_id (fk planets)
- location_id (fk locations)
- name

#### moons
moons that orbit planets where player actions can be taken

- moon_id (pk)
- planet_id (fk planets)
- location_id (fk locations)
- name

#### belts
asteroid belts that orbit planets where player actions can be taken

- belt_id (pk)
- planet_id (fk planets)
- location_id (fk locations)
- name

#### ship_types
represents the different types of space ships in the game

- ship_type_id (pk)
- name
- speed
- size
- max_cargo_size

#### items
the items in the game that can be owned by a player

- item_id (pk)
- name
- size

#### players
the players in the game

- player_id (pk)

#### player_location
represents the location of the player in the universe

- player_id (pk, fk players)
- target_location_id (fk locations)
- prev_location_id (fk locations, nullable)
- departure_time (nullable)
- arrival_time

#### player_ships
represents ships owned by a player

- player_ship_id (pk)
- player_id (fk players)
- ship_id (fk ships)
- station_celestial_id (fk stations, nullable)

#### player_active_ship
represents a player's active ship (can only be one at a time)

- player_id (pk, unique, fk players)
- player_ship_id (fk player_ships, unique, nullable)

#### player_ship_inventory
represents the items in a player's ship inventory

- player_ship_id (fk player_ships)
- item_id (fk items)
- amount

#### player_station_inventory
represents the player's items in space station stations

- player_id (fk players)
- station_celestial_id (fk stations)
- item_id (fk items)
- amount
