import React, { useEffect, useRef, useState, useMemo } from "react";
import { Text, StyleSheet, View, Animated, Button } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, AvatarAction } from "@/types/avatar";
import { preloadFrames } from "@/functions/sprite-animations";
import { BattleActions, BattleOutcome } from "@/types/battle";

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

const sampleBattleResult: BattleOutcome = {
  winner: attacker,
  loser: defender,
  numberOfTurns: 5,
  actions: [
    {
      attacker: attacker,
      defender: defender,
      damageDealt: 23,
      attackerHealth: 100,
      defenderHealth: 77,
      isCritical: false,
      isDodged: false,
    },
    {
      attacker: defender,
      defender: attacker,
      damageDealt: 0,
      attackerHealth: 77,
      defenderHealth: 100,
      isCritical: false,
      isDodged: false,
    },
  ],
};

const AttackTab = () => {
  const IDLE_DURATION_MS = 3000; // Configurable idle duration in milliseconds
  const FRAME_INTERVAL_MS = 70;

  const [attackerAction, setAttackerAction] = useState<AvatarAction>("idle");
  const [defenderAction, setDefenderAction] = useState<AvatarAction>("idle");

  const [attackerCurrentFrame, setAttackerCurrentFrame] = useState(0);
  const [defenderCurrentFrame, setDefenderCurrentFrame] = useState(0);
  const [attackerFramesList, setAttackerFramesList] = useState<Record<
    AvatarAction,
    string[]
  > | null>(null);
  const [defenderFramesList, setDefenderFramesList] = useState<Record<
    AvatarAction,
    string[]
  > | null>(null);

  const attackerPosition = useRef(new Animated.Value(0)).current;
  const defenderPosition = useRef(new Animated.Value(0)).current;
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  const [isPreloaded, setIsPreloaded] = useState(false);

  const preloadFramesForAllAvatars = async () => {
    try {
      const [attackerFrames, defenderFrames] = await Promise.all([
        preloadFrames(attacker.avatarId),
        preloadFrames(defender.avatarId),
      ]);

      setAttackerFramesList(attackerFrames);
      setDefenderFramesList(defenderFrames);

      setIsPreloaded(true); // Mark as preloaded
      console.log("All assets preloaded.");
    } catch (error) {
      console.error("Error preloading assets:", error);
      setIsPreloaded(false); // Handle failure scenario
    }
  };

  const clearAllIntervals = () => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  };

  useEffect(() => {
    preloadFramesForAllAvatars();

    return () => clearAllIntervals();
  }, []);

  const calculateFrameInterval = (totalDuration: number, numFrames: number) => {
    return totalDuration / numFrames; // ms per frame
  };

  const playAnimation = (
    setAction: React.Dispatch<React.SetStateAction<AvatarAction>>,
    setCurrentFrame: React.Dispatch<React.SetStateAction<number>>,
    action: AvatarAction,
    frames: string[],
    totalDuration: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (!frames || frames.length === 0) {
        resolve();
        return;
      }

      const frameInterval = calculateFrameInterval(
        totalDuration,
        frames.length
      );

      setAction(action);
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, frameInterval);

      setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, totalDuration);
    });
  };

  const calculateDuration = (frames: string[]): number => {
    return frames.length * FRAME_INTERVAL_MS;
  };

  interface PhaseParams {
    framesList: Record<AvatarAction, string[]> | null;
    setAction: React.Dispatch<React.SetStateAction<AvatarAction>>;
    setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
    position?: Animated.Value; // Optional, only required for runPhase
  }

  const startIdleLoop = (
    actor: Avatar,
    setAction: React.Dispatch<React.SetStateAction<AvatarAction>>,
    setCurrentFrame: React.Dispatch<React.SetStateAction<number>>,
    framesList: Record<AvatarAction, string[]> | null
  ) => {
    if (!framesList?.idle) return;

    const idleInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % framesList.idle.length);
    }, calculateFrameInterval(IDLE_DURATION_MS, framesList.idle.length));

    setAction("idle");
    intervalsRef.current.push(idleInterval);
  };

  const stopIdleLoop = () => {
    clearAllIntervals(); // Stop all idle animations
  };

  const runPhase = async (actor: Avatar, params: PhaseParams) => {
    stopIdleLoop(); // Pause idle while running

    const { framesList, setAction, setCurrentFrame, position } = params;

    if (!framesList?.run || !position) return;

    const runDuration = calculateDuration(framesList.run);
    const targetPosition = actor === attacker ? 100 : -100; // Attacker moves right, Defender moves left

    setAction("run");

    Animated.timing(position, {
      toValue: targetPosition,
      duration: runDuration,
      useNativeDriver: true,
    }).start();

    await playAnimation(
      setAction,
      setCurrentFrame,
      "run",
      framesList.run,
      runDuration
    );

    Animated.timing(position, {
      toValue: 0, // Back to the original position
      duration: runDuration,
      useNativeDriver: true,
    }).start();

    startIdleLoop(actor, setAction, setCurrentFrame, framesList); // Resume idle after run
  };

  const attackPhase = async (actor: Avatar, params: PhaseParams) => {
    stopIdleLoop(); // Pause idle while attacking

    const { framesList, setAction, setCurrentFrame } = params;

    if (!framesList?.attack) return;

    const attackDuration = calculateDuration(framesList.attack);

    await playAnimation(
      setAction,
      setCurrentFrame,
      "attack",
      framesList.attack,
      attackDuration
    );

    startIdleLoop(actor, setAction, setCurrentFrame, framesList); // Resume idle after attack
  };

  const hitPhase = async (actor: Avatar, params: PhaseParams) => {
    stopIdleLoop(); // Pause idle while being hit

    const { framesList, setAction, setCurrentFrame } = params;

    if (!framesList?.hit) return;

    const hitDuration = calculateDuration(framesList.hit);

    await playAnimation(
      setAction,
      setCurrentFrame,
      "hit",
      framesList.hit,
      hitDuration
    );

    startIdleLoop(actor, setAction, setCurrentFrame, framesList); // Resume idle after hit
  };

  const showBattlePreview = async (actions: BattleActions[]) => {
    const getPhaseParams = (actor: Avatar): PhaseParams => {
      const framesList =
        actor === attacker ? attackerFramesList : defenderFramesList;
      const setAction =
        actor === attacker ? setAttackerAction : setDefenderAction;
      const setCurrentFrame =
        actor === attacker ? setAttackerCurrentFrame : setDefenderCurrentFrame;
      const position = actor === attacker ? attackerPosition : defenderPosition;

      return {
        framesList,
        setAction,
        setCurrentFrame,
        position,
      };
    };

    // Start idle loops
    if (attackerFramesList?.idle) {
      startIdleLoop(
        attacker,
        setAttackerAction,
        setAttackerCurrentFrame,
        attackerFramesList
      );
    }

    if (defenderFramesList?.idle) {
      startIdleLoop(
        defender,
        setDefenderAction,
        setDefenderCurrentFrame,
        defenderFramesList
      );
    }

    for (const action of actions) {
      const attackerParams = getPhaseParams(action.attacker);
      const defenderParams = getPhaseParams(action.defender);

      // Attacker runs
      await runPhase(action.attacker, attackerParams);

      // Attacker attacks
      await attackPhase(action.attacker, attackerParams);

      if (action.isDodged) {
        // Defender dodges
        await runPhase(action.defender, defenderParams);
      } else {
        // Defender gets hit
        await hitPhase(action.defender, defenderParams);
      }

      // Defender runs before attacking (if it's their turn)
      if (action.attacker === defender) {
        await runPhase(action.attacker, defenderParams);
        await attackPhase(action.attacker, defenderParams);
      }
    }
  };

  const preloadedAttackerFrames = useMemo(() => {
    if (!attackerFramesList) return null;
    return attackerFramesList[attackerAction] || attackerFramesList.idle || [];
  }, [attackerFramesList, attackerAction]);

  const preloadedDefenderFrames = useMemo(() => {
    if (!defenderFramesList) return null;
    return defenderFramesList[defenderAction] || defenderFramesList.idle || [];
  }, [defenderFramesList, defenderAction]);

  return (
    <ThemedView style={styles.wrapper}>
      <Text>Battle Preview</Text>
      <View style={styles.spriteContainer}>
        <View style={styles.attackerWrapper}>
          <Animated.View
            style={[
              styles.attackerContainer,
              { transform: [{ translateX: attackerPosition }] },
            ]}
          >
            <Animated.Image
              source={{
                uri:
                  preloadedAttackerFrames?.[attackerCurrentFrame] ||
                  preloadedAttackerFrames?.[0] ||
                  "",
              }}
              style={styles.attacker}
            />
          </Animated.View>
        </View>
        <View style={styles.defenderWrapper}>
          <Animated.View
            style={[
              styles.defenderContainer,
              { transform: [{ translateX: defenderPosition }] },
            ]}
          >
            <Animated.Image
              source={{
                uri:
                  preloadedDefenderFrames?.[defenderCurrentFrame] ||
                  preloadedDefenderFrames?.[0] ||
                  "",
              }}
              style={styles.defender}
            />
          </Animated.View>
        </View>
      </View>
      {
        isPreloaded && (
          <Button
            title="Start Battle"
            onPress={() => showBattlePreview(sampleBattleResult.actions)}
          />
        ) // Show button only when assets are preloaded
      }
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  spriteContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "25%",
    position: "relative",
  },
  attackerWrapper: {
    width: "40%",
    height: "100%",
    position: "absolute",
    left: 0,
  },
  attackerContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  attacker: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  defenderWrapper: {
    width: "40%",
    height: "100%",
    position: "absolute",
    right: 0,
  },
  defenderContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  defender: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    transform: [{ scaleX: -1 }],
  },
});

export default AttackTab;
