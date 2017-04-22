var towerFire = function(numberOfShots, noteArray, tower, boat) {
  if (tower.tmp.timer != 0) return;
  var newNote = noteArray.create(tower.x, tower.y, "note");
  newNote.lifespan = 50;
  tower.tmp.timer = tower.behaviour.reload;
}

var towers = {
  SINGLESHOT: {
    reload: 100,
    damage: 10,
    aim: shootFirst, // Generic tower
    fire: towerFire.bind(this, 1), 
    icon: "singleshot",
  },

  AREA: {
    reload: 1,
    damage: 1,
    aim: shootFirst, //Will activate if any in range
    icon: "areashot",
  },

  STARE: {
    reload: 1,
    damage: 2,
    aim: shootClosest, // Stare at closest victim  
    icon: "stare",
  },
}
