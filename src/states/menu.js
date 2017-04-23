var Menu = function() {}

Menu.prototype = {
  init: function() {
  },

  preload: function() {
    game.load.image("bg", "../res/img/Title.png");
    game.load.image("bt", "../res/img/StartButton.png");
  },

  create: function() {
    game.add.sprite(0,0,"bg");
    console.log("MENU :: GAME INITIALISED");
    var x = game.add.sprite(100, 300, "bt");
    x.inputEnabled = true;
    game.input.onDown.add(this.go, this);
  },
  go: function() { game.state.start("Manager");}
  
}
