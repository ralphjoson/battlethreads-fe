import { battleOutcome } from "@/functions/battle";
import { Avatar } from "@/types/avatar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  ImageBackground,
  Animated,
} from "react-native";
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

  let attackerHealthLocal = attacker.stats.health;
  let defenderHealthLocal = defender.stats.health;

  const [attackerFrame, setAttackerFrame] = useState(0);
  const [defenderFrame, setDefenderFrame] = useState(0);

  const [attackerHealth, setAttackerHealth] = useState(attacker.stats.health); // Current health for attacker
  const [defenderHealth, setDefenderHealth] = useState(defender.stats.health); // Current health for defender

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
        className="sprite-container"
        style={[
          styles.spriteContainer,
          {
            width: config.width,
            height: config.height,
            left: attackerPosition,
            top: 50, // Fixed y-coordinate
          },
        ]}
      >
        <Animated.Image
          source={config.image}
          style={[
            styles.sprite,
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
        className="sprite-container"
        style={[
          styles.spriteContainer,
          {
            width: config.width,
            height: config.height,
            left: defenderPosition,
            top: 50, // Fixed y-coordinate
            transform: [
              { scaleX: -1.5 }, // Flip and scale horizontally
              { scaleY: 1.5 }, // Scale vertically
            ],
          },
        ]}
      >
        <Animated.Image
          source={config.image}
          style={[
            styles.sprite,
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

  const HealthBar = ({
    health,
    maxHealth,
    isDefender,
  }: {
    health: number;
    maxHealth: number;
    isDefender?: boolean;
  }) => {
    return (
      <View style={styles.healthBar}>
        <View
          style={[
            styles.health,
            {
              width: `${(health / maxHealth) * 100}%`,
              transform: isDefender ? [{ scaleX: -1 }] : [],
            },
          ]}
        ></View>
      </View>
    );
  };

  const systems = [
    (_, { time }: any) => {
      // Update attacker frame
      const attackerConfig = SPRITE_CONFIGS.attacker[animationConfig.attacker];
      if (
        animationConfig.attacker !== "death" ||
        attackerFrame < attackerConfig.frameCount - 1
      ) {
        const newAttackerFrame =
          Math.floor(time.current / attackerConfig.frameDuration) %
          attackerConfig.frameCount;
        setAttackerFrame(newAttackerFrame);
      }

      // Update defender frame
      const defenderConfig = SPRITE_CONFIGS.defender[animationConfig.defender];
      if (
        animationConfig.defender !== "death" ||
        defenderFrame < defenderConfig.frameCount - 1
      ) {
        const newDefenderFrame =
          Math.floor(time.current / defenderConfig.frameDuration) %
          defenderConfig.frameCount;
        setDefenderFrame(newDefenderFrame);
      }
    },
  ];

  const processActions = async (actions: any[]) => {
    const initialPositions = {
      attacker: 50, // Initial x-position for the attacker
      defender: 200, // Initial x-position for the defender
    };

    let currentAttackerHealth = attackerHealth; // Local copy for attacker health
    let currentDefenderHealth = defenderHealth; // Local copy for defender health

    const getPhaseParams = (actor: string) => {
      const isAttacker = actor === attacker.username;
      return {
        framesList: isAttacker
          ? SPRITE_CONFIGS.attacker
          : SPRITE_CONFIGS.defender,
        setAction: (action: SpriteActions) =>
          setAnimationConfig((prev) => ({
            ...prev,
            [isAttacker ? "attacker" : "defender"]: action,
          })),
        setPosition: isAttacker ? setAttackerPosition : setDefenderPosition,
        attackPosition: isAttacker ? 190 : 60,
        dodgePosition: isAttacker ? 10 : 250,
        resetPosition: isAttacker
          ? initialPositions.attacker
          : initialPositions.defender,
        setHealth: isAttacker ? setAttackerHealth : setDefenderHealth,
        getHealth: () =>
          isAttacker ? currentAttackerHealth : currentDefenderHealth, // Use local health copy
        updateHealth: (newHealth: number) => {
          if (isAttacker) {
            currentAttackerHealth = newHealth;
            // setAttackerHealth(newHealth);
          } else {
            currentDefenderHealth = newHealth;
            // setDefenderHealth(newHealth);
          }
        },
        maxHealth: isAttacker ? attacker.stats.health : defender.stats.health,
      };
    };

    // Pause briefly before starting the battle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const action of actions) {
      const attacking =
        action.attacker === attacker.username ? "attacker" : "defender";
      const defending = attacking === "attacker" ? "defender" : "attacker";

      const attackingParams = getPhaseParams(action.attacker);
      const defendingParams = getPhaseParams(action.defender);

      console.log(`${action.attacker} is attacking ${action.defender}`);

      // Move attacking sprite to attack position
      attackingParams.setAction("run");
      attackingParams.setPosition(attackingParams.attackPosition);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Perform attack animation
      attackingParams.setAction("attack");
      if (action.isDodged) {
        console.log(`${action.defender} dodged the attack!`);
        defendingParams.setPosition(defendingParams.dodgePosition);
        defendingParams.setAction("roll");
      } else {
        defendingParams.setAction("hit");
      }
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          attackingParams.framesList.attack.frameCount *
            attackingParams.framesList.attack.frameDuration
        )
      );

      // Handle defending sprite response
      if (action.isDodged) {
        defendingParams.setPosition(defendingParams.resetPosition);
      } else {
        // Apply hit animation and health deduction
        defendingParams.setAction("hit");

        // Use local health copy for updates
        const currentHealth = defendingParams.getHealth();
        const newHealth = Math.max(currentHealth - action.damageDealt, 0);

        console.log("*********************************");
        // Set attackerHealthLocal and defenderHealthLocal
        if (attacking === "attacker") {
          attackerHealthLocal = newHealth;
          console.log("attackerHealthLocal", attackerHealthLocal);
        } else {
          defenderHealthLocal = newHealth;
          console.log("defenderHealthLocal", defenderHealthLocal);
        }
        console.log("*********************************");

        console.log(
          `${action.defender} takes damage: ${action.damageDealt}, health: ${currentHealth} → ${newHealth}`
        );

        defendingParams.updateHealth(newHealth);

        await new Promise((resolve) =>
          setTimeout(
            resolve,
            defendingParams.framesList.hit.frameCount *
              defendingParams.framesList.hit.frameDuration
          )
        );

        // If health is zero, trigger death animation
        if (newHealth === 0) {
          console.log(`${action.defender} has been defeated!`);
          defendingParams.setAction("death");
          await new Promise((resolve) =>
            setTimeout(
              resolve,
              defendingParams.framesList.death.frameCount *
                defendingParams.framesList.death.frameDuration
            )
          );

          // Reset winner's position and set to idle
          attackingParams.setPosition(attackingParams.resetPosition);
          attackingParams.setAction("idle");
          return; // End battle after death
        }
      }

      // Reset positions and animations to idle
      attackingParams.setPosition(attackingParams.resetPosition);
      attackingParams.setAction("idle");

      if (defendingParams.getHealth() > 0) {
        defendingParams.setAction("idle");
      }

      // Pause briefly before the next action
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // After battle: Ensure winner is idle and at their original position
    if (currentAttackerHealth > 0) {
      const attackingParams = getPhaseParams(attacker.username);
      attackingParams.setPosition(attackingParams.resetPosition);
      attackingParams.setAction("idle");
    } else if (currentDefenderHealth > 0) {
      const defendingParams = getPhaseParams(defender.username);
      defendingParams.setPosition(defendingParams.resetPosition);
      defendingParams.setAction("idle");
    }
  };

  const showPreview = async () => {
    const battleResult = battleOutcome(attacker, defender);
    console.log("attacker", attacker);
    console.log("defender", defender);
    setBattleLogs(battleResult.actions.map((a) => JSON.stringify(a)));
    console.log("battleResult", battleResult);
    await processActions(battleResult.actions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.environment}>
        <ImageBackground
          source={require("@assets/images/environments/forest.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <GameEngine style={styles.engine} systems={systems} entities={{}} />
          <View style={styles.healthBarWrapper}>
            <View style={styles.healthBar}>
              <Text style={styles.healthNumber}>{attackerHealthLocal}</Text>
              <View
                style={[
                  styles.health,
                  {
                    width: `${
                      (attackerHealthLocal / attacker.stats.health) * 100
                    }%`,
                  },
                ]}
              ></View>
            </View>
            <View style={styles.healthBar}>
              <Text style={styles.healthNumber}>{defenderHealthLocal}</Text>
              <View
                style={[
                  styles.health,
                  {
                    width: `${
                      (defenderHealthLocal / defender.stats.health) * 100
                    }%`,
                  },
                ]}
              ></View>
            </View>
          </View>
          <AttackerSprite />
          <DefenderSprite />
        </ImageBackground>
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.info}>Attacker Health:</Text>
        <Text style={styles.info}>tests</Text>
      </View>
      <Button title="Start" onPress={showPreview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  engine: {
    position: "relative",
  },
  environment: {
    position: "relative",
    height: 200,
    backgroundImage: require("@assets/images/environments/forest.png"),
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    backgroundColor: "red",
  },
  infoWrapper: {
    backgroundColor: "#101010",
    color: "#FFFFFF",
    height: 200,
    padding: 20,
  },
  info: {
    color: "#FFFFFF",
  },
  spriteContainer: {
    position: "absolute",
    overflow: "hidden",
    transform: [{ scale: 1.5 }],
  },
  sprite: {
    transitionProperty: "all",
    transitionDuration: "700ms",
  },
  healthBarWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    position: "absolute",
    top: 30,
    width: "100%",
  },
  healthBar: {
    height: 15,
    width: "40%",
    backgroundColor: "red",
    borderRadius: 3,
    borderColor: "white",
    borderWidth: 1,
    position: "relative",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  health: {
    backgroundColor: "green",
    height: "100%",
    transitionProperty: "width",
    transitionDuration: "200ms",
    textAlign: "center",
  },
  healthNumber: {
    color: "white",
    fontSize: 10,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default AnimatedSprite;
