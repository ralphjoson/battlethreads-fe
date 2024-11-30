const akstar = {
  attack: {
    image: require("@assets/sprites/akstar/attack.png"),
    columns: 3,
    rows: 5,
    width: 151,
    height: 110,
    frameCount: 13,
    frameDuration: 10,
  },
  run: {
    image: require("@assets/sprites/akstar/move.png"),
    columns: 1,
    rows: 1,
    width: 71,
    height: 69,
    frameCount: 1,
    frameDuration: 10,
  },
  idle: {
    image: require("@assets/sprites/akstar/idle.png"),
    columns: 3,
    rows: 2,
    width: 69,
    height: 80,
    frameCount: 4,
    frameDuration: 10,
  },
  roll: {
    image: require("@assets/sprites/akstar/move.png"),
    columns: 1,
    rows: 1,
    width: 71,
    height: 69,
    frameCount: 1,
    frameDuration: 10,
  },
  hit: {
    image: require("@assets/sprites/akstar/idle.png"),
    columns: 3,
    rows: 2,
    width: 69,
    height: 80,
    frameCount: 4,
    frameDuration: 10,
  },
  dying: {
    image: require("@assets/sprites/akstar/dying.png"),
    columns: 1,
    rows: 1,
    width: 55,
    height: 55,
    frameCount: 1,
    frameDuration: 10,
  },
  dead: {
    image: require("@assets/sprites/akstar/dead.png"),
    columns: 1,
    rows: 1,
    width: 68,
    height: 40,
    frameCount: 1,
    frameDuration: 10,
  },
  winBefore: {
    image: require("@assets/sprites/akstar/win_before.png"),
    columns: 3,
    rows: 7,
    width: 74,
    height: 81,
    frameCount: 20,
    frameDuration: 10,
  },
  win: {
    image: require("@assets/sprites/akstar/win.png"),
    columns: 3,
    rows: 8,
    width: 65,
    height: 60,
    frameCount: 24,
    frameDuration: 10,
  },
};

export default akstar;