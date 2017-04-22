var Game = function() {};

Game.prototype = {
  boats: null,
  towers: null,
  notes: null,
  volText: null,
  powerUse: null,
  select: null,
  river: null,

  // Buttons
  sineButton: null,
  constantButton: null,
  buttonSelected: null,
  towerToPlace: -1,

  init: function() {
    setCurrency(100);
  },

  preload: function() {
    game.load.image("river", "../res/img/game-placeholder-bg.png");
    game.load.image("boat", "../res/img/Boat.png");
    game.load.image("tower", "../res/img/Tower.png");
    game.load.image("gun", "../res/img/Gun.png");
    game.load.image("note", "../res/img/Note.png");
    game.load.image("rider", "../res/img/Rider.png");
    game.load.image("AOE", "../res/img/AOE.png");
    game.load.image("Select", "../res/img/Select.png");
    game.load.image("bg", "../res/img/BG.png");
    game.load.image("sineButton", "../res/img/SineButton.png");
    game.load.image("constantButton", "../res/img/ConstantButton.png");
    game.load.image("buttonSelect", "../res/img/ButtonSelect.png");
  },

  create: function() {
    game.add.sprite(0,0,"bg");
    this.river = game.add.sprite(0,0,"river");
    this.river.inputEnabled = true;
    this.river.input.pixelPerfectClick = true;
    this.boats = game.add.group();
    this.towers = game.add.group();
    this.notes = game.add.group();
    this.spawnBoat();
    game.input.onDown.add(()=>{
      this.select.x = -100;
      // Check for if we've clicked a previously exisiting node
      var clickedOn = this.towers.filter((tower) => (
        getAbsoluteDistance(game.input.activePointer, tower) < tower.width/2
      ));
      // If not, spawn
      if (clickedOn.first) {
        this.select.x = clickedOn.first.x;
        this.select.y = clickedOn.first.y;
        this.select.selected = clickedOn.first;
      } else {
        if (!this.river.input.pointerOver()) {
          // Butt
          if (this.constantButton.input.pointerOver()) {
            this.buttonSelected.x = this.constantButton.x;
            this.buttonSelected.y = this.constantButton.y;
            this.towerToPlace = 1;
          } else if (this.sineButton.input.pointerOver()) {
            this.buttonSelected.x = this.sineButton.x;
            this.buttonSelected.y = this.sineButton.y;
            this.towerToPlace = 2;
          } else {
            if (this.towerToPlace != -1)         
              this.spawnTower(this.towers);
          }
        }
      }
    });
    this.volText = game.add.text(0,0,"Volume at mouse: 0 dB");
    this.powerUse = game.add.text(0, 550, "Power Usage: 0 w");
    this.select = game.add.sprite(-100, -100, "Select");
    this.select.anchor.setTo(0.5, 0.5);

    // Add buttons
    this.constantButton = game.add.sprite(700, 550, "constantButton");
    this.sineButton     = game.add.sprite(750, 550, "sineButton");
    this.constantButton.inputEnabled = true;
    this.sineButton.inputEnabled = true;
    this.buttonSelected = game.add.sprite(-100, -100, "buttonSelect");
  },

  update: function() {
    // Get the volume at the current mouse position
    var vol = this.getVolAt(game.input.activePointer);
    this.volText.text = "Volume at mouse: "+Number(vol).toFixed(2)+" dB"
    var power = this.towers.children.map((tower)=>(tower.wave.powerUse)).sum()
    this.powerUse.text = "Power Usage: "+Number(power).toFixed(2)+" w";
  
    // Check for power surge
    if (power > 5) {
      this.towers.forEach((t)=>{t.wave.resetWave()});
    }

    this.boats.forEachAlive((boat) => {
      boat.rotation = Phaser.Math.angleBetweenPoints(
                        new Phaser.Point(0,0),
                        new Phaser.Point(boat.deltaX, boat.deltaY))

      // Deal damage
      boat.health -= this.getVolAt(boat);
      boat.healthIndicator.clear();
      boat.healthIndicator.beginFill(0xFF0000);
      boat.healthIndicator.drawRect(boat.x-50, boat.y-50, 100, 20);
      boat.healthIndicator.beginFill(0x00FF00);
      boat.healthIndicator.drawRect(boat.x-49, boat.y-49, boat.health, 18);
      boat.healthIndicator.endFill();
    });

    this.towers.forEach((tower) => {
      tower.wave.update();
      tower.towerAOE.alpha = tower.wave.output / 10;
    });

  },

  getVolAt: function(point) {
    // First, get all nodes in range
    // So that'll be distance <= 100*range
    var inRange = this.towers.filter(
      (tower) => (getAbsoluteDistance(point,
                                      tower) <= 100*tower.range));
    var s = 0;
    inRange.list.forEach((i)=>(s+=i.wave.output));
    return s;
  },

  spawnBoat: function() {
    var thisBoat = this.boats.create(850, 400, "boat");
    thisBoat.anchor.setTo(0.5,0.5);
    // Start the boat off on its magical journey to the asylum
    var t = game.add.tween(thisBoat).to( 
      {x: Levels.coords[0].map((x)=>(x.x)),
       y: Levels.coords[0].map((x)=>(x.y))},
      16000,
      "Linear"
    );
    t.interpolation(Phaser.Math.catmullRomInterpolation);
    t.onComplete.add(this.killBoat);
    thisBoat.tweenie = t;
    thisBoat.health = 100;
    thisBoat.healthIndicator = game.add.graphics(0,0);
    
    t.start();
  },

  killBoat: function(boat) {
    console.log("BOAT DYING");
    boat.kill();
    boat.healthIndicator.clear();
  },

  spawnTower: function(tGroup) {
    var thisTow = tGroup.create(game.input.activePointer.x, 
                                game.input.activePointer.y, 
                                "tower");
    thisTow.anchor.setTo(0.5, 0.5);
    thisTow.range = 1;
    thisTow.power = 1;
    switch (this.towerToPlace) {
      case 1:
        thisTow.wave  = new waveBehaviour(waves.CONSTANT, 1);
        break;
      case 2:
        thisTow.wave  = new waveBehaviour(waves.SINE, 1, 1, 0);
        break;
    }
    thisTow.towerAOE = game.add.sprite(game.input.activePointer.x,
                                       game.input.activePointer.y, "AOE")
    thisTow.towerAOE.alpha = 0.1;
    thisTow.towerAOE.anchor.setTo(0.5, 0.5);
    thisTow.towerAOE.scale.setTo(2,2);
  }
}
