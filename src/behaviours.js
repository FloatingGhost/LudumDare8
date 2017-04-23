var waves = {
  CONSTANT: function(amplitude) {
    return amplitude;
  },

  SINE: function(amplitude, freq, offset, x) {
    return amplitude * Math.sin(x*freq + offset)
  },
}

var waveBehaviour = function(waveType, amp, freq, offset) {
  this.waveType=waveType;
  this.amp = amp;
  this.freq = freq;
  this.offset = offset;
  this.damageMultiplier = 1;
  
  // Game balance - intermittent speakers are cheaper
  switch (this.waveType) {
    case waves.CONSTANT:
      this.powerMultiplier = 1.2;
      break;
    case waves.SINE:
      this.powerMultiplier = 1;
      break;
    default:
      this.powerMultiplier = 1;
  }
}

waveBehaviour.prototype = {
  curTime: 0,
  output:  0,
  powerUse: 0,
  zeroTicks: 0,
  rangeModifier: 0,
  isOff: false,

  canPowerUp: function() {
    // Have a cap on damage multipliers 
    return this.damageMultiplier <= 4;    
  },

  powerUp: function() {
    // increase damage
    this.damageMultiplier += 1;
  },

  canRangeUp: function() {
    return this.rangeModifier <=2;
  },

  rangeUp: function() {
    this.rangeModifier += 1;
  },

  togglePower: function() {
    this.isOff = !this.isOff;
    console.log("TOWER ",this.isOff);
  },

  incrementFreq: function() {
    this.freq = (this.freq + 1)%10;
    if (this.freq == 0) this.freq++;
  },

  decrementFreq: function() {
    this.freq--;
    if (this.freq == 0) this.freq = 9;
  },

  incrementOff: function() {
    this.offset = (this.offset + 1)%10;
    if (this.offset == 0) this.offset++;
  },                        
                            
  decrementOff: function() {
    this.offset--;
    if (this.offset == 0) this.offset = 9;
  },

  update: function() {
    // On tick, update waveform
    if (this.zeroTicks) {
      this.output = 0;
      this.powerUse = 0;
      this.zeroTicks--;
      return;    
    }
    if (this.isOff) {
      this.powerUse = 0;
      this.output = 0;
      this.curTime = 0;
      return;
    }

    this.curTime += 0.1;
    this.output = this.damageMultiplier * this.waveType(this.amp, this.freq, 
                                                  this.offset, this.curTime);
    // We don't ever want to heal the riders' sanity
    if (this.output < 0) this.output = 0;
    // Power use should be exponential to stop users just 
    // pumping up the volume
    this.powerUse = this.powerMultiplier*(Math.pow(Math.E, this.output) - 1);
  },

  resetWave: function() {
    // Used if power goes over maximum threshold
    // We'll hold at 0 for 100 ticks
    // Then carry on
    this.powerUse = 0;
    this.zeroTicks = BLACKOUT;
  }
}

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

if (!Array.prototype.sum){
    Array.prototype.sum = function() {
      return this.reduce((a,b)=>(a+b), 0)
    };
}

if (!Array.prototype.tail){
    Array.prototype.tail = function() {
      return this.filter((a,i)=>(i!=0))
    };
}

var getAbsoluteDistance = function(s1, s2) {
  return Math.sqrt(
            Math.pow(Math.abs(s1.centerX - s2.x), 2) + 
            Math.pow(Math.abs(s1.centerY - s2.y), 2));
};

var filterByDistance = function(tower, boatGroup, maxRange) {
  return boatGroup.filter(
    (boat) => (getAbsoluteDistance(tower, boat) <= maxRange))
};

var shootFirst = function(tower, boatGroup) {
  var dist = filterByDistance(tower, boatGroup, TARGETING_RANGE*(1+tower.wave.rangeModifier));
  return dist.first;
};

var shootLast = function(tower, boatGroup) {
  return filterByDistance(tower, boatGroup, 200).last();
};

var shootClosest = function(tower, boatGroup) {
  return filterByDistance(tower, boatGroup, 200).sort(
    (boatA, boatB) => (getAbsoluteDistance(tower, boatA) >
                       getAbsoluteDistance(tower, boatB))).first;
}; 
