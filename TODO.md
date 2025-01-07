# spacemfers todos

### STAR SYSTEM NAVIGATION

warping between planets and just flying around and exploring and stuff.

- [x] get camera/background combo + screen responsiveness working GOOD ENOUGH
- [x] add some predefined stuff in the view and check it out at different zoom levels and stuff
- [x] create "align-to" system
- [x] create "approach" system
- [x] refine approach system
- [ ] add some predefined stuff far AF away, like 10+ AU; make it show in overview nice (in AU units)
- [ ] tinker with a warp system: for starters, just a debug btn to warp to predefined spots far away
  - align to target
  - thrust to max speed
  - when ship hits max speed, enter WARP towards the destination (??? how might this work, what does eve do? ???)
- [ ] yeet the old instance-based timestamp-ey celestial system code
  - this will be a bit of a job since the player is coupled w/ the old location system
  - not big prio since backend isn't being used for this yet, it's all in the game client

### MVP UI

the basic ui needed for moving forward

- [x] a "Selected Item Panel"
- [x] top left: show current location like x & y and stuff just for now
- [ ] update the ship controls with slider for granular percentage, make that group it's own component as well
- [ ] hijack the default context menu; just do a no-op for now

### MISC

- [ ] add more parallax layers for further zooms, reuse the 3 textures but group them in teirs or whatever, like 2 layers of the far png, 2 for mid etc; will get more zoom distance coverage out of them without needing to make a huge initial one to cover entire viewport 
- [ ] use the ship stats to determine the speed and turn speed (with max speed and mass attributes)
- [ ] place a bright sun thing in the background so it will be realistic where the sun is in relation to where you are in the star system, ex: if ur bottom right of star system, sun will be shining in top left
