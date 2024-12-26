# spacemfers todos

### STAR SYSTEM NAVIGATION

warping between planets and just flying around and exploring and stuff.

- [x] get camera/background combo + screen responsiveness working GOOD ENOUGH
- [ ] add some predefined stuff in the view and check it out at different zoom levels and stuff
- [ ] tinker with an approach system: for starters, just a debug btn to approach a predefined spot
  - align to target
  - thrust to max speed
- [ ] add some predefined stuff far AF away, like 10+ au
- [ ] tinker with a warp system: for starters, just a debug btn to warp to predefined spots far away
  - align to target
  - thrust to max speed
  - when ship hits max speed, enter WARP towards the destination (??? how might this work, what does eve do? ???)
- [ ] yeet the old instance-based timestamp-ey celestial system code
  - this will be a bit of a job since the player is coupled w/ the old location system
  - not big prio since backend isn't being used for this yet, it's all in the game client

### MISC

- [ ] fix the janky flight; not smooth, i think its floating point num related, maybe the rounding somewhere in the navigation logic
- [ ] add a cool foreground parallax layer that sits between the camera and ship and is really fast with little wispy light & semi-transparent specks
- [ ] use the ship stats to determine the speed and turn speed (with max speed and mass attributes)
- [ ] make the offset of the nebula background based on the coordinates within the entire system, place a bright sun thing right in the middle of the nebula background so it will be realistic where the sun is in relation to where you are in the star system
