var towerFire = function(numberOfShots, noteArray, tower, boat) {
  if (tower.tmp.timer != 0) return;
  var newNote = noteArray.create(tower.x, tower.y, "note");
  newNote.lifespan = 50;
  tower.tmp.timer = tower.behaviour.reload;
}

var towers = {
  CONSTANT: {
    power: 1,
    aim: shootFirst, // Generic tower
    icon: "tower",
    angle: 60,
    range: 1,
    cost: 15,
    powerUse: 1.2,
    wave: waves.CONSTANT,
  },

  SINE: {
    power: 1.2,
    aim: shootFirst,
    icon: "eye",
    angle: 45,
    range: 1,
    cost: 10, 
    powerUse: 1,
    wave: waves.SINE,
  }
}
