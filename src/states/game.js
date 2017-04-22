var Game = function() {};

Game.prototype = {
  boats: null,
  towers: null,

  init: function() {

  },

  preload: function() {
    game.load.image("bg", "../res/img/game-placeholder-bg.png");
    game.load.image("boat", "../res/img/Boat.png");
    game.load.image("tower", "../res/img/Tower.png");
    game.load.image("gun", "../res/img/Gun.png");
    game.load.image("note", "../res/img/Note.png");
  },

  create: function() {
    game.add.sprite(0,0,"bg");
    this.boats = game.add.group();
    this.towers = game.add.group();
    this.spawnBoat();
  },

  update: function() {
    this.towers.forEach(
      (tower) => {
        var toTarget = tower.behaviour(tower, this.boats);
        if (toTarget)
          tower.gun.rotation = Phaser.Math.angleBetweenPoints(
                                tower, toTarget) + Math.PI/2;
      });
  },

  spawnBoat: function() {
    var thisBoat = this.boats.create(700, 350, "boat");
    // Start the boat off on its magical journey to the asylum
    var t = game.add.tween(thisBoat).to( 
      {x: Levels.coords[0].map((x)=>(x.x - 100)),
       y: Levels.coords[0].map((x)=>(x.y - 50))},
      16000,
      "Linear"
    );
    t.interpolation(Phaser.Math.catmullRomInterpolation);
    t.onComplete.add(this.killBoat);
    t.start();
  },

  killBoat: function(boat) {
    console.log("BOAT DYING");
    boat.kill();
  }
}
