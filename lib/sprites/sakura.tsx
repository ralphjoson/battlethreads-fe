import { CharacterSprites } from "@/types/avatar";

const sakura: CharacterSprites = {
  attack: {
    // 843x465
    image: require("@assets/sprites/sakura/attack.png"),
    columns: 3,
    rows: 5,
    width: 281,
    height: 93,
    frameCount: 13,
    frameDuration: 10,
  },
  idle: {
    image: require("@assets/sprites/sakura/idle.png"),
    columns: 3,
    rows: 15,
    width: 97,
    height: 106,
    frameCount: 43,
    frameDuration: 10,
  },
  hit: {
    image: require("@assets/sprites/sakura/idle.png"),
    columns: 3,
    rows: 15,
    width: 97,
    height: 106,
    frameCount: 43,
    frameDuration: 10,
  },
  dying: {
    image: require("@assets/sprites/sakura/dying.png"),
    columns: 1,
    rows: 1,
    width: 77,
    height: 58,
    frameCount: 1,
    frameDuration: 10,
  },
  dead: {
    image: require("@assets/sprites/sakura/dead.png"),
    columns: 1,
    rows: 1,
    width: 85,
    height: 45,
    frameCount: 1,
    frameDuration: 10,
  },
  winBefore: {
    // 378x720
    image: require("@assets/sprites/sakura/win_before.png"),
    columns: 3,
    rows: 8,
    width: 126,
    height: 90,
    frameCount: 22,
    frameDuration: 10,
  },
  win: {
    // 249x366
    image: require("@assets/sprites/sakura/win.png"),
    columns: 3,
    rows: 6,
    width: 83,
    height: 61,
    frameCount: 16,
    frameDuration: 10,
  },
  walk: {
    image: require("@assets/sprites/sakura/idle.png"),
    columns: 3,
    rows: 15,
    width: 97,
    height: 106,
    frameCount: 43,
    frameDuration: 10,
  },
  critical: {
    image: require("@assets/sprites/sakura/critical.png"),
    columns: 3,
    rows: 8,
    width: 376,
    height: 237,
    frameCount: 24,
    frameDuration: 10,
  },
  run: {
    image: require("@assets/sprites/sakura/idle.png"),
    columns: 3,
    rows: 15,
    width: 97,
    height: 106,
    frameCount: 43,
    frameDuration: 10,
  },
  roll: {
    image: require("@assets/sprites/sakura/idle.png"),
    columns: 3,
    rows: 15,
    width: 97,
    height: 106,
    frameCount: 43,
    frameDuration: 10,
  },
};

export default sakura;