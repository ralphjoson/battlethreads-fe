import { battleOutcome } from "@/functions/battle";
import { Avatar } from "@/types/avatar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Button } from "react-native";
import { GameEngine } from "react-native-game-engine";

const attacker: Avatar = {
  username: "Attacker",
  avatarId: "2",
  stats: {
    attack: 25,
    defense: 10,
    criticalChance: 20,
    criticalDamageModifier: 50,
    dodgeChance: 15,
    level: 1,
    agility: 10,
    health: 100,
    experience: 0,
  },
};

const defender: Avatar = {
  username: "Defender",
  avatarId: "3",
  stats: {
    attack: 255,
    defense: 255,
    criticalChance: 50,
    criticalDamageModifier: 100,
    dodgeChance: 40,
    level: 99,
    agility: 255,
    health: 9999,
    experience: 0,
  },
};

type SpriteActions = "attack" | "run" | "idle" | "roll";

const SPRITE_CONFIGS: Record<
  string,
  Record<
    SpriteActions,
    {
      image: any;
      columns: number;
      rows: number;
      width: number;
      height: number;
      frameCount: number;
      frameDuration: number;
    }
  >
> = {
  attacker: {
    attack: {
      image: require("@assets/sprites/knight-a/_AttackCombo2hit.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 100,
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
    idle: {
      image: require("@assets/sprites/knight-a/_Idle.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 100,
    },
    roll: {
      image: require("@assets/sprites/knight-a/_Roll.png"),
      columns: 12,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 12,
      frameDuration: 100,
    },
  },
  defender: {
    attack: {
      image: require("@assets/sprites/knight-b/_AttackCombo.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 100,
    },
    run: {
      image: require("@assets/sprites/knight-b/_Run.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 100,
    },
    idle: {
      image: require("@assets/sprites/knight-b/_Idle.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 100,
    },
    roll: {
      image: require("@assets/sprites/knight-b/_Roll.png"),
      columns: 12,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 12,
      frameDuration: 100,
    },
  },
};

const AttackerSprite = ({
  currentFrame,
  position,
}: {
  currentFrame: number;
  position: number[];
}) => {
  const config = SPRITE_CONFIGS.attacker["idle"];
  const getFramePosition = (frame: number) => {
    const row = Math.floor(frame / config.columns);
    const col = frame % config.columns;
    return { x: col * config.width, y: row * config.height };
  };

  const { x, y } = getFramePosition(currentFrame);
  let test = 10;
  // set x position to random from 50 to 100 every 50ms
  setInterval(() => {
    test = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
  }, 50);
  return (
    <View
      style={[
        styles.spriteContainer,
        {
          width: config.width,
          height: config.height,
          left: position ? position[0] : 50,
          top: position ? position[1] : 100,
        },
      ]}
    >
      <Image
        source={config.image}
        style={{
          position: "absolute",
          width: config.columns * config.width,
          height: config.rows * config.height,
          left: -x,
          top: -y,
        }}
      />
    </View>
  );
};

const DefenderSprite = ({
  currentFrame,
  position,
}: {
  currentFrame: number;
  position: number[];
}) => {
  const config = SPRITE_CONFIGS.defender["idle"];
  const getFramePosition = (frame: number) => {
    const row = Math.floor(frame / config.columns);
    const col = frame % config.columns;
    return { x: col * config.width, y: row * config.height };
  };

  const { x, y } = getFramePosition(currentFrame);

  return (
    <View
      style={[
        styles.spriteContainer,
        {
          width: config.width,
          height: config.height,
          left: position ? position[0] : 200,
          top: position ? position[1] : 100,
          transform: "scaleX(-1)",
        },
      ]}
    >
      <Image
        source={config.image}
        style={{
          position: "absolute",
          width: config.columns * config.width,
          height: config.rows * config.height,
          left: -x,
          top: -y,
        }}
      />
    </View>
  );
};

const AnimatedSprite = () => {
  const [attackerFrame, setAttackerFrame] = useState(0);
  const [defenderFrame, setDefenderFrame] = useState(0);
  const [currentAction, setCurrentAction] = useState<number>(0);
  const [animationConfig, setAnimationConfig] = useState<
    Record<"attacker" | "defender", SpriteActions>
  >({
    attacker: "idle",
    defender: "idle",
  });

  const processActions = async (actions: any[]) => {
    const getPhaseParams = (actor: Avatar) => {
      const isAttacker = actor === attacker;
      return {
        framesList: isAttacker
          ? SPRITE_CONFIGS.attacker
          : SPRITE_CONFIGS.defender,
        setAction: (action: SpriteActions) =>
          setAnimationConfig((prev) => ({
            ...prev,
            [isAttacker ? "attacker" : "defender"]: action,
          })),
      };
    };

    setAnimationConfig({
      attacker: "idle",
      defender: "idle",
    });

    for (const action of actions) {
      const attackerParams = getPhaseParams(action.attacker);
      const defenderParams = getPhaseParams(action.defender);

      // Attacker runs
      attackerParams.setAction("run");
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          attackerParams.framesList.run.frameCount *
            attackerParams.framesList.run.frameDuration
        )
      );

      // Attacker attacks
      attackerParams.setAction("attack");
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          attackerParams.framesList.attack.frameCount *
            attackerParams.framesList.attack.frameDuration
        )
      );

      if (action.isDodged) {
        // Defender dodges
        defenderParams.setAction("roll");
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            defenderParams.framesList.roll.frameCount *
              defenderParams.framesList.roll.frameDuration
          )
        );
      } else {
        // Defender gets hit
        defenderParams.setAction("idle");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Defender runs and attacks if it's their turn
      if (action.attacker.username === defender.username) {
        defenderParams.setAction("run");
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            defenderParams.framesList.run.frameCount *
              defenderParams.framesList.run.frameDuration
          )
        );

        defenderParams.setAction("attack");
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            defenderParams.framesList.attack.frameCount *
              defenderParams.framesList.attack.frameDuration
          )
        );
      }

      setAnimationConfig({
        attacker: "idle",
        defender: "idle",
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const showPreview = async () => {
    const battleResult = battleOutcome(attacker, defender);

    // Process battleResult actions
    processActions(battleResult.actions);
  };

  const systems = [
    (entities: any, { time }: any) => {
      entities.attacker.currentFrame =
        Math.floor(
          time.current /
            SPRITE_CONFIGS.attacker[animationConfig.attacker].frameDuration
        ) % SPRITE_CONFIGS.attacker[animationConfig.attacker].frameCount;

      entities.defender.currentFrame =
        Math.floor(
          time.current /
            SPRITE_CONFIGS.defender[animationConfig.defender].frameDuration
        ) % SPRITE_CONFIGS.defender[animationConfig.defender].frameCount;

      return entities;
    },
  ];

  return (
    <View style={styles.container}>
      <GameEngine
        style={styles.engine}
        systems={systems}
        entities={{
          attacker: {
            currentFrame: attackerFrame,
            renderer: (
              <AttackerSprite
                currentFrame={attackerFrame}
                // x position is random from 50 to 100
                position={[50, 100]}
              />
            ),
          },
          defender: {
            currentFrame: defenderFrame,
            renderer: (
              <DefenderSprite
                currentFrame={defenderFrame}
                position={[200, 100]}
              />
            ),
          },
        }}
      />
      <Button
        title="Starts"
        onPress={() => {
          showPreview();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  engine: {
    position: "relative",
  },
  spriteContainer: {
    position: "absolute",
    overflow: "hidden",
  },
});

export default AnimatedSprite;
