var Game = function() {};

Game.prototype = {
  boats: null,
  towers: null,
  notes: null,
  volText: null,

  init: function() {
    console.log(this);
    setCurrency(100);
  },

  preload: function() {
    game.load.image("bg", "../res/img/game-placeholder-bg.png");
    game.load.image("boat", "../res/img/Boat.png");
    game.load.image("tower", "../res/img/Tower.png");
    game.load.image("gun", "../res/img/Gun.png");
    game.load.image("note", "../res/img/Note.png");
    game.load.image("rider", "../res/img/Rider.png");
    game.load.image("AOE", "../res/img/AOE.png");
  },

  create: function() {
    game.add.sprite(0,0,"bg");
    this.boats = game.add.group();
    this.towers = game.add.group();
    this.notes = game.add.group();
    this.spawnBoat();
    game.input.onDown.add(this.spawnTower.bind(this, this.towers));
    this.volText = game.add.text(0,0,"Volume at mouse: 0 dB");
  },

  update: function() {
    // Get the volume at the current mouse position
    
    var vol = this.getVolAtMouse();
    this.volText.text = "Volume at mouse: "+vol+" dB"
  },

  getVolAtMouse: function() {
    // First, get all nodes in range
    // So that'll be distance <= 100*range
    var inRange = this.towers.filter(
      (tower) => (getAbsoluteDistance(game.input.activePointer,
                                      tower) <= 100*tower.range));
    var s = 0;
    console.log(inRange);
    inRange.list.forEach((i)=>(s+=i.power));
    return s;
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
  },

  spawnTower: function(tGroup) {
    var thisTow = tGroup.create(game.input.activePointer.x, 
                                game.input.activePointer.y, 
                                "tower");
    thisTow.anchor.setTo(0.5, 0.5);
    thisTow.range = 1;
    thisTow.power = 1;
    thisTow.towerAOE = game.add.sprite(game.input.activePointer.x,
                                       game.input.activePointer.y, "AOE")
    thisTow.towerAOE.alpha = 0.1;
    thisTow.towerAOE.anchor.setTo(0.5, 0.5);
    thisTow.towerAOE.scale.setTo(2,2);
  }
}
