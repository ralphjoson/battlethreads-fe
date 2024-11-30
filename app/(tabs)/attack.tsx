import React, { useState } from "react";
import { StyleSheet, View, Button, ImageBackground } from "react-native";
import { GameEngine } from "react-native-game-engine";
import * as sprites from "../../lib/sprites/_sprites";
import Sprite from "@/components/Sprite";
import { Avatar, AvatarAction } from "@/types/avatar";
import FightScene from "@/constants/FightScene";
import { battleOutcome } from "@/functions/battle";

const SPRITE_CONFIGS = {
  playerA: sprites.akstar,
  playerB: sprites.sakura,
};

type PlayerEntity = {
  position: [number, number];
  action: AvatarAction;
  renderer: ({
    position,
    action,
  }: {
    position: [number, number];
    action: AvatarAction;
  }) => JSX.Element;
};

type HealthBarEntity = {
  position: [number, number];
  remainingHealth: number;
  renderer: ({
    position,
    remainingHealth,
  }: {
    position: [number, number];
    remainingHealth: number;
  }) => JSX.Element;
};

const attacker: Avatar = {
  id: "Attacker",
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
  id: "Defender",
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

// System to handle dispatched events and update entities
const ActionSystem = (
  entities: { [key: string]: PlayerEntity | HealthBarEntity },
  { events }: { events: any }
) => {
  events.forEach(
    (event: {
      type: string;
      entity: string;
      action?: AvatarAction;
      moveTo?: [number, number];
      damage?: number;
    }) => {
      if (event.type === "change-action" && event.entity && event.action) {
        const entity = entities[event.entity] as PlayerEntity;
        if (entity) {
          entity.action = event.action; // Update the entity's action
        }
      }

      if (event.type === "move-entity" && event.entity && event.moveTo) {
        const entity = entities[event.entity] as PlayerEntity;
        if (entity) {
          entity.position = event.moveTo; // Update the entity's position
        }
      }

      if (
        event.type === "update-health" &&
        event.entity &&
        event.damage !== undefined
      ) {
        const healthBar = entities[`${event.entity}Health`] as HealthBarEntity;
        if (healthBar) {
          healthBar.remainingHealth = Math.max(
            0,
            healthBar.remainingHealth - event.damage
          ); // Deduct health but ensure it doesn't go below 0
        }
      }

      if (event.type === "reset-health") {
        const healthBar = entities[`${event.entity}Health`] as HealthBarEntity;
        if (healthBar) {
          healthBar.remainingHealth = 100; // Reset health to 100
        }
      }
    }
  );

  return entities;
};

const AnimatedSprite = () => {
  const [defaultPositions, setDefaultPositions] = useState<{
    [key: string]: [number, number];
  }>({
    attacker: [FightScene.margin + SPRITE_CONFIGS.playerA.idle.width, 90],
    defender: [
      FightScene.width - SPRITE_CONFIGS.playerB.idle.width - FightScene.margin,
      90,
    ],
  });
  const [currentPositions, setCurrentPositions] = useState<{
    [key: string]: [number, number];
  }>({
    attacker: [defaultPositions.attacker[0], defaultPositions.attacker[1]],
    defender: [defaultPositions.defender[0], defaultPositions.defender[1]],
  });
  let currentAttackerPosition = currentPositions.attacker;
  const [entities] = useState<{
    [key: string]: PlayerEntity | HealthBarEntity;
  }>({
    playerA: {
      position: currentAttackerPosition,
      action: "idle",
      renderer: ({
        position,
        action,
      }: {
        position: [number, number];
        action: AvatarAction;
      }) => {
        const spriteConfig =
          SPRITE_CONFIGS.playerA[action as keyof typeof SPRITE_CONFIGS.playerA];
        return (
          <View
            style={{
              position: "absolute",
              left: position[0],
              top: position[1],
              transitionProperty: "left, top",
              transitionDuration: "100ms",
              transform: [{ scaleX: -1 }],
            }}
          >
            <Sprite
              src={spriteConfig.image}
              frameWidth={spriteConfig.width}
              frameHeight={spriteConfig.height}
              frameCount={spriteConfig.frameCount}
              fps={spriteConfig.frameDuration}
              columns={spriteConfig.columns}
            />
          </View>
        );
      },
    },
    playerAHealth: {
      position: [10, 10],
      remainingHealth: attacker.stats.health,
      renderer: ({
        position,
        remainingHealth,
      }: {
        position: [number, number];
        remainingHealth: number;
      }) => (
        <View
          style={{
            position: "absolute",
            left: position[0],
            top: position[1],
            width: "40%",
            height: 10,
            backgroundColor: "#b75454",
            borderWidth: 1,
            borderColor: "#FFF",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <View
            style={{
              width: `${remainingHealth}%`,
              height: "100%",
              backgroundColor: "#5ac466",
            }}
          />
        </View>
      ),
    },
    playerB: {
      position: currentPositions.defender,
      action: "idle",
      renderer: ({
        position,
        action,
      }: {
        position: [number, number];
        action: AvatarAction;
      }) => {
        const spriteConfig = SPRITE_CONFIGS.playerB[action];
        return (
          <View
            style={{
              position: "absolute",
              left: position[0],
              top: position[1],
              transitionProperty: "left, top",
              transitionDuration: "100ms",
            }}
          >
            <Sprite
              src={spriteConfig.image}
              frameWidth={spriteConfig.width}
              frameHeight={spriteConfig.height}
              frameCount={spriteConfig.frameCount}
              fps={spriteConfig.frameDuration}
              columns={spriteConfig.columns}
            />
          </View>
        );
      },
    },
    playerBHealth: {
      position: [FightScene.width - FightScene.width * 0.4 - 10, 10],
      remainingHealth: defender.stats.health,
      renderer: ({
        position,
        remainingHealth,
      }: {
        position: [number, number];
        remainingHealth: number;
      }) => (
        <View
          style={{
            position: "absolute",
            left: position[0],
            top: position[1],
            width: "40%",
            height: 10,
            backgroundColor: "#b75454",
            borderWidth: 1,
            borderColor: "#FFF",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <View
            style={{
              width: `${remainingHealth}%`,
              height: "100%",
              backgroundColor: "#5ac466",
            }}
          />
        </View>
      ),
    },
  });

  let gameEngineRef: GameEngine | null = null;

  const handleActionChange = (entity: string, action: AvatarAction) => {
    if (gameEngineRef) {
      (gameEngineRef as any).dispatch({
        type: "change-action",
        entity,
        action,
      });
    }
  };

  const calculateAttackerPosition = (
    entity: "playerA" | "playerB",
    attackerPosition: [number, number],
    defenderPosition: [number, number]
  ) => {
    // Calculate the width and height differences
    let x =
      SPRITE_CONFIGS[entity].attack.width - SPRITE_CONFIGS[entity].idle.width;
    let y =
      SPRITE_CONFIGS[entity].attack.height - SPRITE_CONFIGS[entity].idle.height;

    // Adjust x if the attack sprite is significantly wider
    if (
      SPRITE_CONFIGS[entity].attack.width / SPRITE_CONFIGS[entity].idle.width >
      1.5
    ) {
      x = x / 2;
    }

    const opponentEntity = entity === "playerA" ? "playerB" : "playerA";

    if (entity === "playerA") {
      // Align x and y for playerA
      x = defenderPosition[0] + x;
      y =
        defenderPosition[1] +
        SPRITE_CONFIGS[entity].idle.height -
        SPRITE_CONFIGS[entity].attack.height;
    } else {
      // Align x and y for playerB
      x = defenderPosition[0] - x;
      y =
        defenderPosition[1] +
        SPRITE_CONFIGS[entity].idle.height -
        SPRITE_CONFIGS[entity].attack.height;
    }

    return [x, y];
  };

  const calculateDeadOrDyingPosition = (
    entity: "playerA" | "playerB",
    state: "dying" | "dead" | "win" | "winBefore",
    defaultPosition: [number, number]
  ): [number, number] => {
    // Get the sprite configuration for the current state
    const spriteConfig = SPRITE_CONFIGS[entity][state];
    const idleConfig = SPRITE_CONFIGS[entity].idle;

    // Calculate the width and height differences between the state and idle sprites
    let xOffset = spriteConfig.width - idleConfig.width;
    let yOffset = spriteConfig.height - idleConfig.height;

    // Adjust xOffset if the state sprite is significantly wider
    if (spriteConfig.width / idleConfig.width > 1.5) {
      xOffset = xOffset / 2;
    }

    const opponentEntity = entity === "playerA" ? "playerB" : "playerA";
    const opponentIdleConfig = SPRITE_CONFIGS[opponentEntity].idle;

    // Calculate the final x and y positions
    let x, y;
    if (entity === "playerA") {
      // For playerA, adjust positions relative to the defender
      x = defaultPosition[0] + xOffset;
      y = defaultPosition[1] + idleConfig.height - spriteConfig.height; // Align based on the new state height
    } else {
      // For playerB, adjust positions relative to the attacker
      x = defaultPosition[0] - xOffset;
      y = defaultPosition[1] + idleConfig.height - spriteConfig.height; // Align based on the new state height
    }

    return [x, y];
  };

  const calculateWinPosition = (
    entity: "playerA" | "playerB",
    defaultPosition: [number, number]
  ): [number, number] => {
    // Get the sprite configuration for the "win" state
    const winConfig = SPRITE_CONFIGS[entity].win;
    const idleConfig = SPRITE_CONFIGS[entity].idle;

    // Calculate the width and height differences between the "win" and "idle" sprites
    let xOffset = winConfig.width - idleConfig.width;
    let yOffset = idleConfig.height - winConfig.height; // Win sprite might be taller/shorter

    // Adjust xOffset if the win sprite is significantly wider
    if (winConfig.width / idleConfig.width > 1.5) {
      xOffset = xOffset / 2;
    }

    // Slightly adjust the Y position upwards for a celebratory pose
    const celebratoryYOffset = 20; // Customize this offset as needed

    // Calculate final x and y positions
    let x, y;
    if (entity === "playerA") {
      // For playerA, adjust relative to the defender
      x = defaultPosition[0] + xOffset;
      y =
        defaultPosition[1] +
        (idleConfig.height - winConfig.height) / 2 -
        celebratoryYOffset; // Center based on sprite height and add celebratory shift
    } else {
      // For playerB, adjust relative to the attacker
      x = defaultPosition[0] - xOffset;
      y =
        defaultPosition[1] +
        (idleConfig.height - winConfig.height) / 2 -
        celebratoryYOffset; // Center based on sprite height and add celebratory shift
    }

    return [x, y];
  };

  const showBattlePreview = async () => {
    if (gameEngineRef) {
      console.log("showBattlePreview");

      (gameEngineRef as any).dispatch({
        type: "reset-health",
        entity: "playerA",
      });

      (gameEngineRef as any).dispatch({
        type: "reset-health",
        entity: "playerB",
      });

      const attackerMaxHealth = attacker.stats.health;
      const defenderMaxHealth = defender.stats.health;
      console.log("attacker", attacker);
      console.log("defender", defender);
      const battleResult = battleOutcome(attacker, defender);
      console.log("battleResult", battleResult);

      for (const action of battleResult.actions) {
        console.log("action");
        const attackerEntity =
          action.attacker === attacker.id ? "playerA" : "playerB";
        const defenderEntity =
          action.defender === defender.id ? "playerB" : "playerA";

        const attackerDefaultPosition =
          action.attacker === attacker.id
            ? defaultPositions.attacker
            : defaultPositions.defender;
        const defenderDefaultPosition =
          action.defender === defender.id
            ? defaultPositions.defender
            : defaultPositions.attacker;

        // Move to "run" action
        (gameEngineRef as any).dispatch({
          type: "change-action",
          entity: attackerEntity,
          action: "run",
        });

        // Move attacker near the defender
        await new Promise((resolve) =>
          setTimeout(() => {
            (gameEngineRef as any).dispatch({
              type: "move-entity",
              entity: attackerEntity,
              moveTo: calculateAttackerPosition(
                attackerEntity,
                attackerDefaultPosition,
                defenderDefaultPosition
              ),
            });
            resolve(true);
          }, 100)
        );

        // Switch to "attack" action
        const attackConfig = SPRITE_CONFIGS[attackerEntity].attack;
        const attackDuration =
          (attackConfig.frameCount * 1000) / attackConfig.frameDuration;

        (gameEngineRef as any).dispatch({
          type: "change-action",
          entity: attackerEntity,
          action: "attack",
        });

        // Dodge animation (if applicable)
        if (action.isDodged) {
          const dodgeX = defenderEntity === "playerB" ? 30 : -30;
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: defenderEntity,
            moveTo: [
              defenderDefaultPosition[0] + dodgeX,
              defenderDefaultPosition[1] + 20,
            ],
          });
        } else {
          // Update health if not dodged
          (gameEngineRef as any).dispatch({
            type: "update-health",
            entity: defenderEntity,
            damage: action.damageDealt, // Apply damage dealt to the defender
          });
        }

        await new Promise((resolve) => setTimeout(resolve, attackDuration));

        // If health is less than 25% but not yet dead, switch to "dying" action else, switch to "idle"
        if (
          action.attackerHealth <= attackerMaxHealth * 0.4 &&
          action.attackerHealth > 0
        ) {
          (gameEngineRef as any).dispatch({
            type: "change-action",
            entity: attackerEntity,
            action: "dying",
          });
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: attackerEntity,
            moveTo: calculateDeadOrDyingPosition(
              attackerEntity,
              "dying",
              attackerDefaultPosition
            ),
          });
        } else if (action.attackerHealth <= 0) {
          (gameEngineRef as any).dispatch({
            type: "change-action",
            entity: attackerEntity,
            action: "dead",
          });
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: attackerEntity,
            moveTo: calculateDeadOrDyingPosition(
              attackerEntity,
              "dead",
              attackerDefaultPosition
            ),
          });
        } else {
          // Reset attacker to idle position and action
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: attackerEntity,
            moveTo: attackerDefaultPosition,
          });
          (gameEngineRef as any).dispatch({
            type: "change-action",
            entity: attackerEntity,
            action: "idle",
          });
        }

        // If health is less than 25% but not yet dead, switch to "dying" action else, switch to "idle"
        if (
          action.defenderHealth <= defenderMaxHealth * 0.4 &&
          action.defenderHealth > 0
        ) {
          console.log("defender dying");
          (gameEngineRef as any).dispatch({
            type: "change-action",
            entity: defenderEntity,
            action: "dying",
          });
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: defenderEntity,
            moveTo: calculateDeadOrDyingPosition(
              defenderEntity,
              "dying",
              defenderDefaultPosition
            ),
          });
        } else if (action.defenderHealth <= 0) {
          (gameEngineRef as any).dispatch({
            type: "change-action",
            entity: defenderEntity,
            action: "dead",
          });
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: defenderEntity,
            moveTo: calculateDeadOrDyingPosition(
              defenderEntity,
              "dead",
              defenderDefaultPosition
            ),
          });
        } else {
          // Reset defender's position if dodged
          (gameEngineRef as any).dispatch({
            type: "move-entity",
            entity: defenderEntity,
            moveTo: defenderDefaultPosition,
          });
          (gameEngineRef as any).dispatch({
            type: "change-action",
            entity: defenderEntity,
            action: "idle",
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        attacker.stats.health = attackerMaxHealth;
        defender.stats.health = defenderMaxHealth;
      }

      // Switch winner to "winBefore" action then switch to "win" action
      const winnerEntity =
        battleResult.winner === attacker.id ? "playerA" : "playerB";
      const winnerDefaultPosition =
        defaultPositions[winnerEntity === "playerA" ? "attacker" : "defender"];
      console.log("winnerDefaultPosition", winnerDefaultPosition);
      (gameEngineRef as any).dispatch({
        type: "change-action",
        entity: winnerEntity,
        action: "winBefore",
      });
      (gameEngineRef as any).dispatch({
        type: "move-entity",
        entity: winnerEntity,
        moveTo: calculateDeadOrDyingPosition(
          winnerEntity,
          "winBefore",
          winnerDefaultPosition
        ),
      });
      const winBeforeDuration =
        (SPRITE_CONFIGS[winnerEntity].winBefore.frameCount * 1000) /
        SPRITE_CONFIGS[winnerEntity].winBefore.frameDuration;

      await new Promise((resolve) => setTimeout(resolve, winBeforeDuration));

      (gameEngineRef as any).dispatch({
        type: "change-action",
        entity: winnerEntity,
        action: "win",
      });
      (gameEngineRef as any).dispatch({
        type: "move-entity",
        entity: winnerEntity,
        moveTo: calculateDeadOrDyingPosition(
          winnerEntity,
          "win",
          winnerDefaultPosition
        ),
      });
    }
  };

  return (
    <>
      <View style={styles.engineWrapper}>
        <ImageBackground
          source={require("@assets/images/environments/forest.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <GameEngine
            ref={(ref) => (gameEngineRef = ref)} // Store the GameEngine ref
            style={styles.container}
            systems={[ActionSystem]} // Add ActionSystem to process events
            entities={entities}
          />
        </ImageBackground>
      </View>
      <View style={styles.buttons}>
        <Button title="Chain Events" onPress={showBattlePreview} />
        <Button
          title="Idle"
          onPress={() => handleActionChange("attacker", "idle")}
        />
        <Button
          title="Attack"
          onPress={() => handleActionChange("attacker", "attack")}
        />
        <Button
          title="Win"
          onPress={() => handleActionChange("attacker", "winBefore")}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  engineWrapper: {
    width: "100%",
    height: 200,
  },
  container: {
    flex: 1,
    height: 200,
    width: "100%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

export default AnimatedSprite;
