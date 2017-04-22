if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

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
