const playDef = {
  funcs: [
    function(s) {
      s.inc(0);
    },
    function(s) {
      s.replicate(0);
    },
    function(s) {
      s.replicate(2);
    },
    function(s) {
      s.replicate(1);
    },
    function(s) {
      if (s.age > 2) s.stop();
    }
  ]
};

const levelDef = {
  version: 1,
  dim: { y: 64, x: 64 },
  varStates: [64], // Each entry in this list is the number of states a cell's corresponding variable can have
  setup: level => {
    let centerCell = level.cellByYX(level.dim.y / 2, level.dim.x / 2);
    centerCell.alive = 1;
    centerCell.render = 1;
  }
};

export const gameDef = {
  playDef: playDef,
  levelDef: levelDef
};
