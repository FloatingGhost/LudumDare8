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
  
  money: [
    NaN,  
    100,
  ],

  path: [
    [],
    [
      {x:800, y:530},
      {x:720, y:530},
      {x:657, y:450},
      {x:657, y:230},
      {x:658, y:62},
      {x:615, y:45},
      {x:458, y:45},
      {x:422,  y:105},
      {x:488,y:211},
      {x:511, y:276},
      {x:509, y:325},
      {x:445, y:531},
      {x:356, y:504},
      {x:140, y:500},
      {x:100, y:450},
      {x:164, y:356},
      {x:340, y:290},
      {x:370, y:240},
      {x:210, y:110},
      {x:90,  y:80},
      {x:80,  y:-100}
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

