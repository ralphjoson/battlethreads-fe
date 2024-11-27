import { battleOutcome } from "@/functions/battle";
import { Avatar } from "@/types/avatar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Button, Text } from "react-native";
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

const AnimatedSprite = () => {
  const [animationConfig, setAnimationConfig] = useState<
    Record<"attacker" | "defender", SpriteActions>
  >({
    attacker: "idle",
    defender: "idle",
  });

  const [attackerFrame, setAttackerFrame] = useState(0);
  const [defenderFrame, setDefenderFrame] = useState(0);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);

  const AttackerSprite = ({ position }: { position: number[] }) => {
    const config = SPRITE_CONFIGS.attacker[animationConfig.attacker];

    // Get the position of the current frame in the sprite sheet
    const getFramePosition = (frame: number) => {
      const row = Math.floor(frame / config.columns);
      const col = frame % config.columns;
      return { x: col * config.width, y: row * config.height };
    };

    const { x, y } = getFramePosition(attackerFrame);

    return (
      <View
        style={[
          styles.spriteContainer,
          {
            width: config.width,
            height: config.height,
            left: position[0],
            top: position[1],
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

  const DefenderSprite = ({ position }: { position: number[] }) => {
    const config = SPRITE_CONFIGS.defender[animationConfig.defender];
    const getFramePosition = (frame: number) => {
      const row = Math.floor(frame / config.columns);
      const col = frame % config.columns;
      return { x: col * config.width, y: row * config.height };
    };

    const { x, y } = getFramePosition(defenderFrame);

    return (
      <View
        style={[
          styles.spriteContainer,
          {
            width: config.width,
            height: config.height,
            left: position[0],
            top: position[1],
            transform: [{ scaleX: -1 }],
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

  const systems = [
    (_, { time }: any) => {
      // Calculate the current frame for the attacker
      const attackerConfig = SPRITE_CONFIGS.attacker[animationConfig.attacker];
      const newAttackerFrame =
        Math.floor(time.current / attackerConfig.frameDuration) %
        attackerConfig.frameCount;

      // Update the attacker frame directly
      setAttackerFrame((prevFrame) =>
        prevFrame !== newAttackerFrame ? newAttackerFrame : prevFrame
      );

      // Calculate the current frame for the defender
      const defenderConfig = SPRITE_CONFIGS.defender[animationConfig.defender];
      const newDefenderFrame =
        Math.floor(time.current / defenderConfig.frameDuration) %
        defenderConfig.frameCount;

      // Update the defender frame directly
      setDefenderFrame((prevFrame) =>
        prevFrame !== newDefenderFrame ? newDefenderFrame : prevFrame
      );
    },
  ];

  const processActions = async (actions: any[]) => {
    const getPhaseParams = (actor: string) => {
      const isAttacker = actor === attacker.username;
      return {
        framesList: isAttacker
          ? SPRITE_CONFIGS.attacker
          : SPRITE_CONFIGS.defender,
        setAction: (action: SpriteActions) =>
          setAnimationConfig((prev) => {
            console.log(`${actor} is now performing: ${action}`);
            return {
              ...prev,
              [isAttacker ? "attacker" : "defender"]: action,
            };
          }),
      };
    };

    setAnimationConfig({ attacker: "idle", defender: "idle" });

    for (const action of actions) {
      const attackerParams = getPhaseParams(action.attacker);
      const defenderParams = getPhaseParams(action.defender);

      // Attacker performs an action
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

      // Reset both to idle
      setAnimationConfig({ attacker: "idle", defender: "idle" });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const showPreview = async () => {
    const battleResult = battleOutcome(attacker, defender);
    setBattleLogs(battleResult.actions.map((a) => JSON.stringify(a)));
    // Process battleResult actions
    processActions(battleResult.actions);
  };

  return (
    <View style={styles.container}>
      <GameEngine style={styles.engine} systems={systems} entities={{}} />
      <AttackerSprite position={[50, 100]} />
      <DefenderSprite position={[200, 100]} />
      <View style={styles.infoWrapper}>
        <Text style={styles.info}>{battleLogs}</Text>
      </View>
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
  infoWrapper: {
    backgroundColor: "#fff",
    color: "#000",
    height: 200,
    padding: 20,
  },
  info: {
    color: "#000",
  },
  spriteContainer: {
    position: "absolute",
    overflow: "hidden",
  },
});

export default AnimatedSprite;
