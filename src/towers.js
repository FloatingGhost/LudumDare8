var towers = {
  SINGLESHOT: {
    reload: 100,
    damage: 10,
    behaviour: shootFirst, // Generic tower
    icon: "singleshot",
  },

  AREA: {
    reload: 1,
    damage: 1,
    behaviour: shootFirst, //Will activate if any in range
    icon: "areashot",
  },

  STARE: {
    reload: 1,
    damage: 2,
    behaviour: shootClosest, // Stare at closest victim  
    icon: "stare",
  },
}
