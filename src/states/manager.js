var Manager = function() {}

Manager.prototype = {
  init: function() {
  },
   
  create: function() { 
    if (Levels.path.length == 0) {
      game.state.start("End");
    }
    console.log("LVLMAN :: ENTERING NEW LEVEL");
    Levels.startPos.shift();
    Levels.path.shift();
    Levels.boats.shift();
    Levels.energyCap.shift();
    Levels.lives.shift();
    Levels.money.shift();
    console.log("LVLMAN :: PARAMS ::",
                Levels.energyCap)
    game.state.start("Game");
  },
}
