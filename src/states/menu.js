var Menu = function() {}

Menu.prototype = {
  init: function() {
    console.log("MENU INIT...");
  },

  preload: function() {},

  create: function() {
    console.log("MENU");
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" }; 
    game.add.text(game.world.centreX,game.world.centreY,"READY",style);
    game.state.start("Game");
  }
}
