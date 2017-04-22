var Game = function() {};

Game.prototype = {
  boats: null,

  init: function() {

  },

  preload: function() {
    game.load.image("bg", "../res/img/game-placeholder-bg.png");
    game.load.image("boat", "../res/img/Boat.png");
  },

  create: function() {
    game.add.sprite(0,0,"bg");
    this.boats = game.add.group();
    var testBoat = this.boats.create(700,350,"boat");
    var t = game.add.tween(testBoat).to(
      {x: Levels.coords[0].map((x)=>(x.x - 100)),
       y: Levels.coords[0].map((x)=>(x.y - 50))}, 
      16000,
      "Sine.easeInOut",
      true,
      -1,
      false
    );
    t.interpolation(Phaser.Math.catmullRomInterpolation);
  },

  update: function() {

  }
}
