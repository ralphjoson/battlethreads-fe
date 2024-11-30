export function getAnimationDuration(
  frameCount: number,
  frameInterval: number = 100
) {
  return frameCount * frameInterval; // Total duration in milliseconds
}
