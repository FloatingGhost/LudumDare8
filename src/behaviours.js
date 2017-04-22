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

  update: function() {
    // On tick, update waveform
    if (this.zeroTicks) {
      this.powerUse = 0;
      this.output = 0;
      this.zeroTicks--;
      return;    
    }

    this.curTime += 0.1;
    this.output = this.waveType(this.amp, this.freq, 
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
    this.zeroTicks = 100;
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

var getAbsoluteDistance = function(s1, s2) {
  return Math.sqrt(
            Math.pow(Math.abs(s1.x - s2.x), 2) + 
            Math.pow(Math.abs(s1.y - s2.y), 2));
};

var filterByDistance = function(tower, boatGroup, maxRange) {
  return boatGroup.filter(
    (boat) => (getAbsoluteDistance(tower, boat) <= maxRange))
};

var shootFirst = function(tower, boatGroup) {
  var dist = filterByDistance(tower, boatGroup, 500);
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
