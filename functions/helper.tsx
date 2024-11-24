interface FrameAnimation {
  row: number;
  startFrame: number;
  endFrame: number;
}

export const createSpriteAnimations = (
  spriteSheetWidth: number,
  spriteSheetHeight: number,
  columns: number,
  rows: number,
  frameWidth: number,
  frameHeight: number
): Record<string, FrameAnimation> => {
  const animations: Record<string, FrameAnimation> = {};

  // Assuming each row in the sprite sheet corresponds to a different animation
  for (let row = 0; row < rows; row++) {
    animations[`animation_${row}`] = {
      row, // Use the row index as the row for the animation
      startFrame: 0, // Start from the first frame
      endFrame: columns - 1, // End at the last frame of the row
    };
  }

  return animations;
};
