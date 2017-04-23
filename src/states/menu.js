var Menu = function() {}

Menu.prototype = {
  init: function() {
  },

  preload: function() {},

  create: function() {
    console.log("MENU :: GAME INITIALISED");
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" }; 
    game.add.text(game.world.centreX,game.world.centreY,"READY",style);
    game.state.start("Manager");
  }
}
