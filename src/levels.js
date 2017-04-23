var Boat = function(hp,speed,delay){
  this.hp = hp;
  this.speed = speed;
  this.delay = delay;
}
Boat.prototype = {
  
}
var Levels = {
  startPos: [
    [],
    {x:850, y:400}
  ],

  path: [
    [],
    [
      {x:800, y:400},
      {x:540, y:400},
      {x:490, y:90},
      {x:260, y:90},
      {x:240, y:480},
      {x:150, y:460},
      {x:90,  y:95},
      {x:-100,y:90}
    ],

  ],

  boats: [
    [],
    [ new Boat(100, 1, 5),
      new Boat(100, 1, 5),
      new Boat(100, 1, 5)
    ],
  ],

  energyCap: [
    NaN,
    10,
  ],

  lives: [
    NaN,
    3,
  ],
};

