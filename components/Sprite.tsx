import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet } from "react-native";

interface SpriteProps {
  src: number; // Sprite sheet source (e.g., require('./sprite.png'))
  frameWidth: number; // Width of a single frame
  frameHeight: number; // Height of a single frame
  frameCount: number; // Total number of frames
  fps: number; // Frames per second
  columns: number; // Number of columns in the sprite sheet
}

const Sprite: React.FC<SpriteProps> = ({
  src,
  frameWidth,
  frameHeight,
  frameCount,
  fps,
  columns,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameCount);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [fps, frameCount]);

  const getFramePosition = (frame: number) => {
    const row = Math.floor(frame / columns); // Calculate row index
    const col = frame % columns; // Calculate column index
    return { x: col * frameWidth, y: row * frameHeight };
  };

  const { x, y } = getFramePosition(frameIndex);

  return (
    <View
      style={[
        styles.wrapper,
        { width: frameWidth, height: frameHeight }, // Size matches a single frame
      ]}
    >
      <Image
        source={src}
        style={[
          styles.spriteImage,
          {
            width: columns * frameWidth, // Total width of the sprite sheet
            height: Math.ceil(frameCount / columns) * frameHeight, // Total height of the sprite sheet
            transform: [{ translateX: -x }, { translateY: -y }], // Shift to current frame
          },
        ]}
        resizeMode="cover" // Prevent scaling issues
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden", // Clips the overflowing parts of the image
    backgroundColor: "transparent", // Optional: for debugging
    position: "absolute",
  },
  spriteImage: {
    position: "absolute",
  },
});

export default Sprite;
