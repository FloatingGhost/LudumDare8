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
  sinUI: null,
  // Upgrades
  rangeUp: null,
  powerUp: null,
  togglePow: null,
  surgeIcon: null,
  freqInc: null,
  freqDec: null,
  offInc: null,
  offDec: null,

  // Ui shading
  buttonBar: null,

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
    game.load.image("powerUp", "../res/img/PowerUp.png");
    game.load.image("rangeUp", "../res/img/RangeUp.png");
    game.load.image("togglePow", "../res/img/TogglePower.png");
    game.load.image("powerSymbol", "../res/img/PowerSymbol.png");
    game.load.image("speakerSymbol", "../res/img/SpeakerSmybol.png");
    game.load.image("surgeIcon", "../res/img/SurgeIcon.png");
    game.load.image("powerIcon", "../res/img/OffIcon.png");
    game.load.image("increment", "../res/img/Increment.png");
    game.load.image("decrement", "../res/img/Decrement.png");
  },

  create: function() {
    // Start physics engine for collision detection
    game.physics.startSystem(Phaser.Physics.P2JS);
  
    // Add backgrounds
    game.add.sprite(0,0,"bg");
    this.river = game.add.sprite(0,0,"river");
    this.river.inputEnabled = true;
    this.river.input.pixelPerfectClick = true;
    
    // Add a group to keep track of the various sprites
    this.boats = game.add.group();
    this.towers = game.add.group();
    this.notes = game.add.group();

    // Add UI bar to make user know they shouldn't place a tower there
    this.buttonBar = game.add.graphics();
    this.buttonBar.alpha = 0.3;
    this.buttonBar.beginFill(0x000000);
    this.buttonBar.drawRect(0, 540, 800, 60);
    this.buttonBar.endFill();

    // TEST: Make a boat to make sure it works
    this.spawnBoat();

    // Bind click check
    // Is context-sensitive
    game.input.onDown.add(()=>{
      // Two seperate checks
      // If we've clicked in the button bar, process as a button press
      // Else, do tower placement checks
      if (game.input.activePointer.y > 540) {
        // PROCESS AS A BUTTON
        
        if (this.constantButton.input.pointerOver()) {
          // Selected a CONSTANT tower to place  
          this.buttonSelected.x = this.constantButton.x;
          this.buttonSelected.y = this.constantButton.y;
          this.towerToPlace = 1;
          
        } else if (this.sineButton.input.pointerOver()) {
          // Selected a SINE tower to place
          this.buttonSelected.x = this.sineButton.x;
          this.buttonSelected.y = this.sineButton.y;
          this.towerToPlace = 2;
        
        } else if (this.select.selected) {
          // Upgrade UI is visible. check for clicks
          
          if (this.togglePow.input.pointerOver()) {
            this.select.selected.wave.togglePower();
            this.select.selected.powerIcon.alpha ^= 1;
          } else if (this.powerUp.input.pointerOver()) {
            if (this.select.selected.wave.canPowerUp()) {
              this.select.selected.wave.powerUp();
            }
          } else if (this.rangeUp.input.pointerOver()) {
            if (this.select.selected.wave.canRangeUp()) {
              this.select.selected.wave.rangeUp();
              this.calculateArc(this.select.selected);
            }
          }

          if (this.freqDec.alpha) {
            // Sine UI is visible
        
            if (this.freqInc.input.pointerOver()) {
              this.select.selected.wave.incrementFreq();
              this.freqInc.label.text = this.select.selected.wave.freq;       
            } else if (this.freqDec.input.pointerOver()) {
              this.select.selected.wave.decrementFreq();
              this.freqInc.label.text = this.select.selected.wave.freq
            } else if (this.offInc.input.pointerOver()) {
              this.select.selected.wave.incrementOff();
              this.offInc.label.text = this.select.selected.wave.offset;
            } else if (this.offDec.input.pointerOver()) {
              this.select.selected.wave.decrementOff();
              this.offInc.label.text = this.select.selected.wave.offset;
            }
          } 
        }
        
      } else {
        // PROCESS AS A TOWER PLACE/CLICK
      
        // Check for if we've clicked a previously exisiting node
        var clickedOn = this.towers.filter((tower) => (
          tower.input.pointerOver()));
      
        if (clickedOn.first) {
          // We've selected a tower 
          // Highlight it
          this.select.x = clickedOn.first.x;
          this.select.y = clickedOn.first.y;
          this.select.selected = clickedOn.first;
        
          // Now show the upgrade UI
          this.powerUp.alpha = this.togglePow.alpha = this.rangeUp.alpha = 1;
      
          // If sin, show sine UI
          if (clickedOn.first.wave.waveType == waves.SINE) {
            this.offDec.alpha = this.offInc.alpha = 1;
            this.freqDec.alpha = this.freqInc.alpha = 1
            this.offInc.label.alpha = this.freqInc.label.alpha = 1;

            this.offInc.label.text = clickedOn.first.wave.offset;
            this.freqInc.label.text = clickedOn.first.wave.freq;
          }
        } else {
          // Empty space
          // Deselect any tower
          this.select.selected = null;
          this.select.x=-100;
          this.powerUp.alpha = this.togglePow.alpha = this.rangeUp.alpha = 0;
          this.offInc.label.alpha = this.freqInc.label.alpha = 0;
          this.offDec.alpha = this.offInc.alpha = 0;
          this.freqDec.alpha = this.freqInc.alpha = 0; 

          // Check for spawning conditions
          if (!this.river.input.pointerOver()) {
            // Check that we've selected a tower to place
            if (this.towerToPlace != -1) {
              // All spawning conditions passed
              this.spawnTower(this.towers);
              this.towerToPlace = -1;
              this.buttonSelected.x=-100;
            }
          }
        }
      }
    });
    this.volText = game.add.text(50,550,"Volume at mouse: 0 dB");
    this.powerUse = game.add.text(250, 550, "Power Usage: 0 w");
    this.select = game.add.sprite(-100, -100, "Select");
    this.select.anchor.setTo(0.5, 0.5);

    // Add buttons
    this.constantButton = game.add.sprite(700, 550, "constantButton");
    this.sineButton     = game.add.sprite(750, 550, "sineButton");
    this.constantButton.inputEnabled = true;
    this.sineButton.inputEnabled = true;
    this.buttonSelected = game.add.sprite(-100, -100, "buttonSelect");

    // Add icons
    game.add.sprite(200, 550, "powerSymbol");
    game.add.sprite(0, 550, "speakerSymbol");
    this.surgeIcon = game.add.sprite(200, 500, "surgeIcon");
    this.surgeIcon.alpha = 0;

    // Add upgrade UI
    this.powerUp = game.add.sprite(450, 550, "powerUp");
    this.togglePow = game.add.sprite(350, 550, "togglePow");
    this.rangeUp = game.add.sprite(400, 550, "rangeUp");

    // And sine UI
    this.offInc = game.add.sprite(550, 550, "increment");
    this.offInc.label = game.add.text(520, 550, "0");
    this.offDec = game.add.sprite(550, 570, "decrement");
    this.freqInc = game.add.sprite(650, 550, "increment");
    this.freqInc.label = game.add.text(620, 550, "0");
    this.freqDec = game.add.sprite(650, 570, "decrement");     
    // Make them initially invisible
    this.powerUp.alpha = this.togglePow.alpha = this.rangeUp.alpha = 0;
    this.offInc.alpha = this.offDec.alpha = 0;
    this.freqDec.alpha = this.freqInc.alpha = 0;
    this.freqInc.label.alpha = this.offInc.label.alpha = 0;
 
    // Bind upgrade events
    this.powerUp.inputEnabled = true;
    this.togglePow.inputEnabled = true;
    this.rangeUp.inputEnabled = true;
    this.offInc.inputEnabled = true;
    this.offDec.inputEnabled = true;
    this.freqInc.inputEnabled = true;
    this.freqDec.inputEnabled = true;
  },

  update: function() {
    // Get the volume at the current mouse position
    var vol = this.getVolAt(game.input.activePointer);
    this.volText.text = Number(vol).toFixed(2)+" dB"
    var power = this.towers.children.map((tower)=>(tower.wave.powerUse)).sum()
    this.powerUse.text = Number(power).toFixed(2)+" w";
  
    // Check for power surge
    if (power > 5) {
      this.towers.forEach((t)=>{t.wave.resetWave()});
      this.surgeIcon.alpha = 1;
    } else {
      this.surgeIcon.alpha = 0;
    }

    this.boats.forEachAlive((boat) => {
      boat.rotation = Phaser.Math.angleBetweenPoints(
                        new Phaser.Point(0,0),
                        new Phaser.Point(boat.deltaX, boat.deltaY))

      // Deal damage
      boat.health -= this.getVolAt(new Phaser.Point(boat.centerX, boat.centerY));
      if (boat.health <= 0) {
        this.killBoat(boat);
      }
      if (boat.health > 0) {
        boat.healthIndicator.clear();
        boat.healthIndicator.beginFill(0xFF0000);
        boat.healthIndicator.drawRect(boat.x-50, boat.y-50, 100, 20);
        boat.healthIndicator.beginFill(0x00FF00);
        boat.healthIndicator.drawRect(boat.x-49, boat.y-49, boat.health, 18);
        boat.healthIndicator.endFill();
      }
    });

    this.towers.forEach((tower) => {
      tower.wave.update();
      // Draw AOE
      tower.AOE.alpha = tower.wave.output / 10;  
      // Rotate the AOE to face the target
      var targeting = tower.targetingBehaviour(tower, this.boats);
      if (targeting) {
        tower.AOE.clear();
        tower.AOE.beginFill(0xFF0000);
        var angleToTarget = Phaser.Math.angleBetweenPoints(tower, targeting);
        tower.AOE.rotation = angleToTarget;
        tower.body.rotation = angleToTarget;
        tower.body.offset = new Phaser.Point(-40*Math.cos(-angleToTarget),
                                             -40*Math.sin(angleToTarget));
        tower.body.x = tower.targetX+ 40*Math.cos(-angleToTarget) - 40
        tower.body.y = tower.targetY+ 40*Math.sin(angleToTarget)
        tower.AOE.arc(0,0,100*(1+tower.wave.rangeModifier),
                      Phaser.Math.degToRad(
                        angleToTarget - (tower.angleOfEffect / 2)),
                      Phaser.Math.degToRad(
                        angleToTarget + (tower.angleOfEffect / 2)));
        tower.AOE.endFill();
      } 
    });

  },

  getVolAt: function(point) {
    var s = 0;
    this.towers.forEach((tower) => {
      if (game.physics.p2.hitTest(point, [tower]).length) {
        s += tower.wave.output;
      }
    })
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
    if (boat.health <= 0) {
      modifyCurrency(10);
    }
  },

  spawnTower: function(tGroup) {
    var sX = game.input.activePointer.x;
    var sY = game.input.activePointer.y;
    var thisTow = tGroup.create(sX, sY,"tower");
    thisTow.range = 1;
    thisTow.power = 1;
    thisTow.AOE = game.add.graphics(sX, sY);
    thisTow.targetingBehaviour = shootFirst;
    thisTow.angleOfEffect = 180;
    thisTow.powerIcon = game.add.sprite(sX, sY, "powerIcon")
    thisTow.powerIcon.alpha = 0;

    switch (this.towerToPlace) {
      case 1:
        thisTow.wave  = new waveBehaviour(waves.CONSTANT, 1);
        break;
      case 2:
        thisTow.wave  = new waveBehaviour(waves.SINE, 1, 1, 0);
        break;
    }
    
    game.physics.p2.enable(thisTow, true);
    thisTow.body.static = true;
    thisTow.targetX = sX + thisTow.width;
    thisTow.targetY = sY;
    thisTow.anchor.setTo(0.5, 0.5); 
    thisTow.inputEnabled = true;
    thisTow.pixelPerfectClick = true;
    this.calculateArc(thisTow)
  },

  calculateArc: function(thisTow) {
    var sX = thisTow.targetX;
    var sY = thisTow.targetY;

    var points = [[sX, sY]];
    var aoeRad = Phaser.Math.degToRad(thisTow.angleOfEffect);
    var absDist = 100*(thisTow.wave.rangeModifier + 1);

    thisTow.body.clearShapes();
    
    thisTow.body.offset = new Phaser.Point(-thisTow.width*(thisTow.wave.rangeModifier+1), 0)

    for (var i = -aoeRad/2; i <= aoeRad/2; i += 0.01) {
      // Rotation must start at 0 for the sprite, so we can ignore it!
      points.push([
        sX+(absDist * Math.sin(i + (Math.PI/2))),
        sY+(absDist * Math.cos(i + (Math.PI/2)))
      ]);
    }
    thisTow.body.addPolygon({}, points);
    thisTow.body.x = thisTow.targetX + (thisTow.width * thisTow.wave.rangeModifier);
    thisTow.body.y = thisTow.targetY;
  }
}
