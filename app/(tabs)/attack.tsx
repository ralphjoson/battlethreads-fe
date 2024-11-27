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

type SpriteActions = "attack" | "run" | "idle" | "roll" | "death" | "hit";

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
    hit: {
      image: require("@assets/sprites/knight-a/_Hit.png"),
      columns: 1,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 1,
      frameDuration: 120,
    },
    death: {
      image: require("@assets/sprites/knight-a/_Death.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 150,
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
    hit: {
      image: require("@assets/sprites/knight-b/_Hit.png"),
      columns: 1,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 1,
      frameDuration: 120,
    },
    death: {
      image: require("@assets/sprites/knight-b/_Death.png"),
      columns: 10,
      rows: 1,
      width: 120,
      height: 80,
      frameCount: 10,
      frameDuration: 150,
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

  // Positions for the attacker and defender
  const [attackerPosition, setAttackerPosition] = useState(50); // Initial x-coordinate for attacker
  const [defenderPosition, setDefenderPosition] = useState(200); // Initial x-coordinate for defender

  const [battleLogs, setBattleLogs] = useState<string[]>([]);

  const AttackerSprite = () => {
    const config = SPRITE_CONFIGS.attacker[animationConfig.attacker];

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
            left: attackerPosition,
            top: 100, // Fixed y-coordinate
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

  const DefenderSprite = () => {
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
            left: defenderPosition,
            top: 100, // Fixed y-coordinate
            transform: [{ scaleX: -1 }], // Flip the defender sprite
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
      // Update attacker frame
      const attackerConfig = SPRITE_CONFIGS.attacker[animationConfig.attacker];
      const newAttackerFrame =
        Math.floor(time.current / attackerConfig.frameDuration) %
        attackerConfig.frameCount;
      setAttackerFrame(newAttackerFrame);

      // Update defender frame
      const defenderConfig = SPRITE_CONFIGS.defender[animationConfig.defender];
      const newDefenderFrame =
        Math.floor(time.current / defenderConfig.frameDuration) %
        defenderConfig.frameCount;
      setDefenderFrame(newDefenderFrame);
    },
  ];

  const processActions = async (actions: any[]) => {
    const initialPositions = {
      attacker: 50, // Initial x-position for the attacker
      defender: 200, // Initial x-position for the defender
    };

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
        setPosition: isAttacker ? setAttackerPosition : setDefenderPosition,
        attackPosition: isAttacker ? 190 : 60, // Position when attacking
        resetPosition: isAttacker
          ? initialPositions.attacker
          : initialPositions.defender, // Reset to initial position
      };
    };

    setAnimationConfig({ attacker: "idle", defender: "idle" });

    for (const action of actions) {
      const attackerParams = getPhaseParams(action.attacker);
      const defenderParams = getPhaseParams(action.defender);

      // Move the attacker to the attack position
      attackerParams.setAction("run");
      attackerParams.setPosition(attackerParams.attackPosition);

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

      // Reset attacker position and both sprites to idle
      attackerParams.setAction("run");
      attackerParams.setPosition(attackerParams.resetPosition);
      setAnimationConfig({ attacker: "idle", defender: "idle" });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const showPreview = async () => {
    const battleResult = battleOutcome(attacker, defender);
    setBattleLogs(battleResult.actions.map((a) => JSON.stringify(a)));
    await processActions(battleResult.actions);
  };

  return (
    <View style={styles.container}>
      <GameEngine style={styles.engine} systems={systems} entities={{}} />
      <AttackerSprite />
      <DefenderSprite />
      <View style={styles.infoWrapper}>
        <Text style={styles.info}>{battleLogs.join("\n")}</Text>
      </View>
      <Button title="Start" onPress={showPreview} />
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
