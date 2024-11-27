import React, { useState, useRef } from "react";
import { StyleSheet, View, Image, Button } from "react-native";
import { GameEngine } from "react-native-game-engine";

const SPRITE_CONFIGS = {
  attack: {
    image: require("@assets/sprites/knight-a/_AttackCombo2hit.png"),
    columns: 10,
    rows: 1,
    width: 120,
    height: 80,
    frameCount: 10,
    frameDuration: 100, // Milliseconds per frame
  },
  run: {
    image: require("@assets/sprites/knight-a/_Run.png"),
    columns: 10,
    rows: 1,
    width: 120,
    height: 80,
    frameCount: 10,
    frameDuration: 100,
  },
  hit: {
    image: require("@assets/sprites/knight-a/_Hit.png"),
    columns: 1,
    rows: 1,
    width: 120,
    height: 80,
    frameCount: 1,
    frameDuration: 120,
  },
  roll: {
    image: require("@assets/sprites/knight-a/_Roll.png"),
    columns: 12,
    rows: 1,
    width: 120,
    height: 80,
    frameCount: 12,
    frameDuration: 90,
  },
};

const AnimatedSprite = () => {
  const [currentAction, setCurrentAction] =
    useState<keyof typeof SPRITE_CONFIGS>("attack");
  const [currentFrame, setCurrentFrame] = useState(0);

  const configRef = useRef(SPRITE_CONFIGS[currentAction]);

  const systems = [
    (entities: { sprite: { currentFrame: number } }, { time }: any) => {
      const config = configRef.current;
      const frameIndex =
        Math.floor(time.current / config.frameDuration) % config.frameCount;

      entities.sprite.currentFrame = frameIndex;
      return entities;
    },
  ];

  const getFramePosition = (frame: number) => {
    const config = configRef.current;
    const row = Math.floor(frame / config.columns);
    const col = frame % config.columns;

    return {
      x: col * config.width,
      y: row * config.height,
    };
  };

  const SpriteRenderer = ({ currentFrame }: { currentFrame: number }) => {
    const { x, y } = getFramePosition(currentFrame);
    const config = configRef.current;

    return (
      <View
        style={[
          styles.spriteContainer,
          { width: config.width, height: config.height },
        ]}
      >
        <Image
          source={config.image}
          style={[
            {
              position: "absolute",
              width: config.columns * config.width,
              height: config.rows * config.height,
              left: -x,
              top: -y,
            },
          ]}
        />
      </View>
    );
  };

  const changeAction = (action: keyof typeof SPRITE_CONFIGS) => {
    configRef.current = SPRITE_CONFIGS[action];
    setCurrentAction(action);
    setCurrentFrame(0); // Reset frame index when switching actions
  };

  return (
    <View style={styles.container}>
      <GameEngine
        style={styles.engine}
        systems={systems}
        entities={{
          sprite: {
            currentFrame,
            renderer: <SpriteRenderer currentFrame={currentFrame} />,
          },
        }}
      />
      <View style={styles.controls}>
        <Button title="Attack" onPress={() => changeAction("attack")} />
        <Button title="Run" onPress={() => changeAction("run")} />
        <Button title="Hit" onPress={() => changeAction("hit")} />
        <Button title="Roll" onPress={() => changeAction("roll")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  engine: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spriteContainer: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#111",
  },
});

export default AnimatedSprite;
