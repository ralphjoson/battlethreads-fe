import spritesA from "@assets/sprites/1/sprites";

// Function that accepts sprite id and returns the corresponding sprite frames
export function getSpriteFrames(spriteId: string) {
  switch (spriteId) {
    case "1":
      return spritesA;
    default:
      return [];
  }
}
