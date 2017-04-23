var Game = function() {};

Game.prototype = {
  boats: null,
  towers: null,
  notes: null,
  volText: null,
  powerUse: null,
  select: null,
  river: null,

  infoStyle: {fill:"#ffffff",
              font: "18px Arial"},
  extraStyle: {fill:"#ffffff",
               font:"30px Arial"},
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
  money: null,
  // Ui shading
  buttonBar: null,
  lives: {count:5, text:null},
  maxPower: null, // MAX POWER MAX POWER
  init: function() {
  },

  preload: function() {
    game.load.image("river", "res/img/Level1BG.png");
    game.load.image("boat", "res/img/Boat.png");
    game.load.spritesheet("tower", "res/img/DollA.png",40,40);
    game.load.spritesheet("eye", "res/img/DollB.png", 40,40);
    game.load.image("gun", "res/img/Gun.png");
    game.load.image("note", "res/img/Note.png");
    game.load.image("rider", "res/img/Rider.png");
    game.load.image("AOE", "res/img/AOE.png");
    game.load.image("Select", "res/img/Select.png");
    game.load.image("bg", "res/img/Level1Stage.png");
    game.load.image("sineButton", "res/img/SineButton.png");
    game.load.image("constantButton", "res/img/ConstantButton.png");
    game.load.image("buttonSelect", "res/img/ButtonSelect.png");
    game.load.image("powerUp", "res/img/PowerUp.png");
    game.load.image("rangeUp", "res/img/RangeUp.png");
    game.load.image("togglePow", "res/img/TogglePower.png");
    game.load.image("powerSymbol", "res/img/PowerSymbol.png");
    game.load.image("speakerSymbol", "res/img/SpeakerSmybol.png");
    game.load.image("surgeIcon", "res/img/SurgeIcon.png");
    game.load.image("powerIcon", "res/img/OffIcon.png");
    game.load.image("increment", "res/img/Increment.png");
    game.load.image("decrement", "res/img/Decrement.png");
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
          this.towerToPlace = towers.CONSTANT;
          
        } else if (this.sineButton.input.pointerOver()) {
          // Selected a SINE tower to place
          this.buttonSelected.x = this.sineButton.x;
          this.buttonSelected.y = this.sineButton.y;
          this.towerToPlace = towers.SINE;
        
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
              this.freqInc.label.text = "Freq " + this.select.selected.wave.freq;       
            } else if (this.freqDec.input.pointerOver()) {
              this.select.selected.wave.decrementFreq();
              this.freqInc.label.text = "Freq "+this.select.selected.wave.freq
            } else if (this.offInc.input.pointerOver()) {
              this.select.selected.wave.incrementOff();
              this.offInc.label.text = "Offset "+this.select.selected.wave.offset;
            } else if (this.offDec.input.pointerOver()) {
              this.select.selected.wave.decrementOff();
              this.offInc.label.text = "Offset "+this.select.selected.wave.offset;
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

            this.offInc.label.text = "Offset "+ clickedOn.first.wave.offset;
            this.freqInc.label.text = "Freq "+clickedOn.first.wave.freq;
          } else {
            // Hide zem
            this.offInc.label.alpha = this.freqInc.label.alpha = 0;
            this.offDec.alpha = this.offInc.alpha = 0;
            this.freqDec.alpha = this.freqInc.alpha = 0;
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
              this.spawnTower(this.towerToPlace);
              this.towerToPlace = -1;
              this.buttonSelected.x=-100;
            }
          }
        }
      }
    });
    this.volText = game.add.text(30,550,"Volume at mouse: 0 dB", this.infoStyle);
    this.powerUse = game.add.text(30, 580, "Power Usage: 0 w", this.infoStyle);
    this.select = game.add.sprite(-100, -100, "Select");
    this.select.anchor.setTo(0.5, 0.5);
    this.lives.text = game.add.text(680, 0, "Lives: "+this.lives.count);

    // Add buttons
    this.constantButton = game.add.sprite(600, 550, "constantButton");
    this.sineButton     = game.add.sprite(650, 550, "sineButton");
    this.constantButton.inputEnabled = true;
    this.sineButton.inputEnabled = true;
    this.buttonSelected = game.add.sprite(-100, -100, "buttonSelect");
  
    new Phasetips(game, {
      targetObject: this.sineButton,
      context: "A pulsing eye, deals damage according to a cycle. $15.",
      strokeColor: 0xff0000,
    });

    new Phasetips(game, {
      targetObject: this.constantButton,
      context: "A gnashing mouth. Deals constant damage. $20.",
      strokeColor: 0xff0000,
    });

    // Add icons
    game.add.sprite(5, 578, "powerSymbol");
    game.add.sprite(5, 548, "speakerSymbol");
    this.surgeIcon = game.add.sprite(200, 500, "surgeIcon");
    this.surgeIcon.alpha = 0;

    // Add upgrade UI
    this.powerUp = game.add.sprite(150, 555, "powerUp");
    this.togglePow = game.add.sprite(190, 555, "togglePow");
    this.rangeUp = game.add.sprite(230, 555, "rangeUp");
    this.money = game.add.text(0,0,"Money: "+getCurrency())
    // And sine UI
    this.offInc = game.add.sprite(480, 550, "increment");
    this.offInc.label = game.add.text(400, 550, "Offset 0", this.infoStyle);
    this.offDec = game.add.sprite(480, 570, "decrement");
    this.freqInc = game.add.sprite(580, 550, "increment");
    this.freqInc.label = game.add.text(520, 550, "Freq 0", this.infoStyle);
    this.freqDec = game.add.sprite(580, 570, "decrement");     

    // Make them initially invisible
    this.powerUp.alpha = this.togglePow.alpha = this.rangeUp.alpha = 0;
    this.offInc.alpha = this.offDec.alpha = 0;
    this.freqDec.alpha = this.freqInc.alpha = 0;
    this.freqInc.label.alpha = this.offInc.label.alpha = 0;

    new Phasetips(game, {
      targetObject: this.powerUp,
      context: "Increase damage output - will use more energy"
    }) 

    new Phasetips(game, {
      targetObject: this.rangeUp,
      context: "Increase attack range - will use more energy"
    })

    // Bind upgrade events
    this.powerUp.inputEnabled = true;
    this.togglePow.inputEnabled = true;
    this.rangeUp.inputEnabled = true;
    this.offInc.inputEnabled = true;
    this.offDec.inputEnabled = true;
    this.freqInc.inputEnabled = true;
    this.freqDec.inputEnabled = true;

    console.log("MAIN :: LOAD COMPLETE.");
    // LOAD LEVEL
    this.loadLevel();
  },

  loadLevel: function() {
    this.spawnBoats(Levels.boats[0]); 
    this.maxPower = Levels.energyCap[0];
    setCurrency(Levels.money[0]);
  },

  update: function() {
    // Get the volume at the current mouse position
    this.towers.forEach((i)=>{i.wave.update()});

   var vol = this.getVolAt(game.input.activePointer);
    this.volText.text = Number(vol).toFixed(2)+" dB"
    var power = this.towers.children.map((tower)=>(tower.wave.powerUse)).sum()
    this.money.text = "Money: "+getCurrency();
    this.powerUse.text = Number(power).toFixed(2)+" w (/"+this.maxPower+"w)";
  
    // Check for power surge
    if (power > this.maxPower) {
      this.towers.forEach((t)=>{t.wave.resetWave(); t.animations.stop();});
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
        boat.kill();
        boat.healthIndicator.clear();
        modifyCurrency(10);
        boat.tweenie.stop();
      }
      if (boat.health > 0) {
        boat.healthIndicator.x = boat.x;
        boat.healthIndicator.y = boat.y;
        boat.healthIndicator.clear();
        boat.healthIndicator.beginFill(0xFF0000);
        boat.healthIndicator.drawRect(-35, 0, 70, 10);
        boat.healthIndicator.beginFill(0x00FF00);
        boat.healthIndicator.drawRect(-35, 0, 50*(boat.health/70), 10);
        boat.healthIndicator.endFill();
        boat.healthIndicator.rotation = boat.rotation;
      }
    });

    this.towers.forEach((tower) => {
      // Draw AOE
      tower.AOE.alpha = tower.wave.output / 5;  
      // Rotate the AOE to face the target
      var targeting = tower.targetingBehaviour(tower, this.boats);
      if (targeting && !tower.isOff) {
        tower.animations.play("chomp", 10, true);
        var angleToTarget = Phaser.Math.angleBetweenPoints(tower, targeting);
        tower.body.rotation = (angleToTarget);
        tower.body.offset = new Phaser.Point(-40*Math.cos(-angleToTarget),
                                             -40*Math.sin(angleToTarget));
        tower.body.x = tower.targetX+ 40*Math.cos(-angleToTarget) - 40
        tower.body.y = tower.targetY+ 40*Math.sin(angleToTarget)
      } else {
        tower.animations.stop();
      }
      tower.AOE.rotation = tower.body.rotation + (Phaser.Math.degToRad(tower.angleOfEffect/2));
      tower.AOE.clear();
      tower.AOE.beginFill(0xFF0000);
      tower.AOE.arc(-20,13,RANGE*(1+tower.wave.rangeModifier),
                    0, -Math.PI/3, true);
                    //Phaser.Math.degToRad(
                    //  tower.body.angle - (tower.angleOfEffect / 2)),
                    //Phaser.Math.degToRad(
                    //  tower.body.angle + (tower.angleOfEffect / 2)));
      tower.AOE.endFill();
       
      game.world.bringToTop(tower);
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

  spawnBoat: function(b) {
    console.log("LVLMAN :: SPAWNING...");
    var thisBoat = this.boats.create(Levels.startPos[0].x, 
                                     Levels.startPos[0].y, 
                                     "boat");
    thisBoat.anchor.setTo(0.5,0.5);
    // Start the boat off on its magical journey to the asylum
    var t = game.add.tween(thisBoat).to( 
      {x: Levels.path[0].map((x)=>(x.x)),
       y: Levels.path[0].map((x)=>(x.y))},
      SPEED_MS / b.speed,
      "Linear"
    );
    t.interpolation(Phaser.Math.catmullRomInterpolation);
    t.onComplete.add(this.killBoat, this);
    thisBoat.tweenie = t;
    thisBoat.health = b.hp;
    thisBoat.healthIndicator = game.add.graphics(0,0);
   
    t.start();
  },

  spawnBoats: function(bArray) {
    if (bArray.length == 0) { 
      console.log("LVLMAN :: NO BOATS TO SPAWN. ENDING.")
      return;
    }
    console.log("LVLMAN :: SPAWNING BOAT");
    console.log(bArray[0]);
    this.spawnBoat(bArray[0]);

    console.log("LVLMAN :: DELAY "+bArray[0].delay);
    game.time.events.add(Phaser.Timer.SECOND * bArray[0].delay, 
                         this.spawnBoats.bind(this, bArray.tail()), 
                         this);
  },

  killBoat: function(boat) {
    console.log("BOAT DYING");
    boat.kill();
    boat.healthIndicator.clear();
    if (boat.health <= 0) {
      modifyCurrency(10);
    } else {
      this.lives.count--;
      this.lives.text.text = "Lives: "+this.lives.count;
    }
  },

  spawnTower: function(tower) {
    var sX = game.input.activePointer.x;
    var sY = game.input.activePointer.y;

    var thisTow = this.towers.create(sX, sY, tower.icon);
    
    thisTow.range = tower.range;
    thisTow.power = tower.power;
    thisTow.AOE = game.add.graphics(sX, sY);
    thisTow.targetingBehaviour = tower.aim;
    thisTow.angleOfEffect = tower.angle;
    thisTow.powerIcon = game.add.sprite(sX-20, sY-20, "powerIcon")
    thisTow.powerIcon.alpha = 0;
    thisTow.wave  = new waveBehaviour(tower.wave, 1, 1, 0);
    game.physics.p2.enable(thisTow);
    thisTow.body.static = true;
    thisTow.targetX = sX + thisTow.width;
    thisTow.targetY = sY;
    thisTow.anchor.setTo(0.5, 0.5); 
    thisTow.inputEnabled = true;
    thisTow.pixelPerfectClick = true;
    this.calculateArc(thisTow)
    thisTow.animations.add("chomp");
  },

  calculateArc: function(thisTow) {
    var sX = thisTow.targetX;
    var sY = thisTow.targetY;

    var points = [[sX, sY]];
    var aoeRad = Phaser.Math.degToRad(thisTow.angleOfEffect);
    var absDist = RANGE*(thisTow.wave.rangeModifier + 1);

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
