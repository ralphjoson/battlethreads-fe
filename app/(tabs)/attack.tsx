import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/core";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, AvatarAction } from "@/types/avatar";
import { battleOutcome } from "@/functions/battle";
import { Asset } from "expo-asset";
import frameCounts from "@/lib/spriteFrameCounts";
import {
  getFrameWithFallback,
  preloadFrames,
} from "@/functions/sprite-animations";

const AttackTab = () => {
  const IDLE_DURATION_MS = 5000; // Configurable idle duration in milliseconds
  const FRAME_INTERVAL_MS = 50; // Time each frame is displayed in milliseconds

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [opponentData, setOpponentData] = useState<any>(null);
  const [attackerCurrentFrame, setAttackerCurrentFrame] = useState(0);
  const [defenderCurrentFrame, setDefenderCurrentFrame] = useState(0);
  const animation = useRef(new Animated.Value(1)).current;
  const [attackerAction, setAttackerAction] = useState<AvatarAction>("attack");
  const [attackerFrames, setAttackerFrames] = useState<string[]>([]);

  const [defenderAction, setDefenderAction] = useState<AvatarAction>("idle");
  const [defenderFrames, setDefenderFrames] = useState<string[]>([]);
  const attackerPosition = useRef(new Animated.Value(0)).current;
  const intervalsRef = useRef<number[]>([]);
  const [attackerFallbackImage, setAttackerFallbackImage] =
    useState<string>("");
  const [defenderFallbackImage, setDefenderFallbackImage] =
    useState<string>("");

  const clearAllIntervals = () => {
    intervalsRef.current.forEach((intervalId) => clearInterval(intervalId));
    intervalsRef.current = []; // Reset the stored intervals
  };

  // Sample battle outcome function
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

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermissions();
    clearAllIntervals();

    showBattlePreview();

    // Cleanup logic (if needed)
    return () => {
      // Clear any active animations or intervals inside showBattlePreview if they are global
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setOpponentData(null);
    }, [])
  );

  // Frame animation effect
  useEffect(() => {
    if (opponentData) battleOutcome(attacker, defender);
  }, [opponentData]);

  const handleBarcodeScanned = (event: { data: string; type: string }) => {
    try {
      const parsedData = JSON.parse(event.data);
      setOpponentData(parsedData);
      console.log("Opponent detected:", parsedData);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  };

  const handleMountError = (error: Error | { message: string }) => {
    if (typeof error === "string") {
      console.error("Camera mount error:", error);
    } else {
      console.error("Camera mount error:", error.message);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const showBattlePreview = async (): Promise<void> => {
    const attackersFramesList = await preloadFrames(attacker.avatarId);
    const defendersFramesList = await preloadFrames(defender.avatarId);

    if (
      !attackersFramesList.idle ||
      attackersFramesList.idle.length === 0 ||
      !defendersFramesList.idle ||
      defendersFramesList.idle.length === 0
    ) {
      console.error("No idle frames loaded. Aborting animation.");
      return;
    }

    const calculateDuration = (frames: string[]): number =>
      frames.length * FRAME_INTERVAL_MS;

    const playIdlePhase = async () => {
      setAttackerAction("idle");
      setAttackerFrames(attackersFramesList.idle);
      setDefenderAction("idle");
      setDefenderFrames(defendersFramesList.idle);

      setAttackerCurrentFrame(0);
      setDefenderCurrentFrame(0);

      // Increment frames for idle animation
      const idleInterval = setInterval(() => {
        setAttackerCurrentFrame(
          (prev) => (prev + 1) % (attackersFramesList.idle?.length || 1)
        );
        setDefenderCurrentFrame(
          (prev) => (prev + 1) % (defendersFramesList.idle?.length || 1)
        );
      }, FRAME_INTERVAL_MS);

      await new Promise((resolve) => setTimeout(resolve, IDLE_DURATION_MS));
      clearInterval(idleInterval); // Stop idle frame animation
    };

    const playRunPhase = async () => {
      setAttackerAction("run");
      setAttackerFrames(attackersFramesList.run || []);
      setAttackerCurrentFrame(0);

      const runDuration = calculateDuration(attackersFramesList.run || []);
      const runInterval = setInterval(() => {
        setAttackerCurrentFrame(
          (prev) => (prev + 1) % (attackersFramesList.run?.length || 1)
        );
      }, FRAME_INTERVAL_MS);

      Animated.timing(attackerPosition, {
        toValue: 100,
        duration: runDuration,
        useNativeDriver: true,
      }).start(() => clearInterval(runInterval));

      await new Promise((resolve) => setTimeout(resolve, runDuration));
    };

    const playAttackPhase = async () => {
      setAttackerAction("attack");
      setAttackerFrames(attackersFramesList.attack || []);
      setAttackerCurrentFrame(0);

      const attackDuration = calculateDuration(
        attackersFramesList.attack || []
      );
      const hitTriggerTime = attackDuration - 3 * FRAME_INTERVAL_MS;

      const attackInterval = setInterval(() => {
        setAttackerCurrentFrame(
          (prev) => (prev + 1) % (attackersFramesList.attack?.length || 1)
        );
      }, FRAME_INTERVAL_MS);

      setTimeout(() => {
        setDefenderAction("hit");
        setDefenderFrames(defendersFramesList.hit || []);
        setDefenderCurrentFrame(0);

        const hitInterval = setInterval(() => {
          setDefenderCurrentFrame(
            (prev) => (prev + 1) % (defendersFramesList.hit?.length || 1)
          );
        }, FRAME_INTERVAL_MS);

        setTimeout(() => {
          clearInterval(hitInterval);
          setDefenderAction("idle");
          setDefenderFrames(defendersFramesList.idle || []);
          setDefenderCurrentFrame(0);
        }, calculateDuration(defendersFramesList.hit || []));
      }, hitTriggerTime);

      await new Promise((resolve) => setTimeout(resolve, attackDuration));
      clearInterval(attackInterval);
    };

    const playReturnPhase = async () => {
      setAttackerAction("idle");
      setAttackerFrames(attackersFramesList.idle || []);
      setAttackerCurrentFrame(0);

      Animated.timing(attackerPosition, {
        toValue: 0,
        duration: calculateDuration(attackersFramesList.idle || []),
        useNativeDriver: true,
      }).start();

      await new Promise((resolve) =>
        setTimeout(resolve, calculateDuration(attackersFramesList.idle || []))
      );
    };

    const playBattleSequence = async () => {
      await playIdlePhase(); // Start with idle phase
      await playRunPhase(); // Run towards the defender
      await playAttackPhase(); // Perform the attack
      await playReturnPhase(); // Return to starting position
      await playIdlePhase(); // End with idle phase
    };

    while (true) {
      await playBattleSequence(); // Loop the sequence
    }
  };

  return (
    <>
      {opponentData && (
        <ThemedView style={styles.frame}>
          <ThemedView style={styles.frameWrapper}>
            {/* <CameraView
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={handleBarcodeScanned}
              onCameraReady={() => console.log("Camera is ready")}
              onMountError={handleMountError}
              facing="back"
            /> */}
          </ThemedView>
        </ThemedView>
      )}
      {!opponentData && (
        <ThemedView style={styles.wrapper}>
          <Text>Battle Preview</Text>
          <View style={styles.spriteContainer}>
            <View className="attacker" style={[styles.attackerWrapper]}>
              <Animated.View
                style={[
                  styles.attackerContainer,
                  { transform: [{ translateX: attackerPosition }] },
                ]}
              >
                <Animated.Image
                  source={{
                    uri: getFrameWithFallback(
                      attackerFrames,
                      attackerCurrentFrame % (attackerFrames.length || 1),
                      attackerFrames
                    ),
                  }}
                  style={[styles.attacker, { opacity: animation }]}
                />
              </Animated.View>
            </View>
            <View className="defender" style={[styles.defenderWrapper]}>
              <View style={[styles.defenderContainer]}>
                <Animated.Image
                  source={{
                    uri: getFrameWithFallback(
                      defenderFrames,
                      defenderCurrentFrame % (defenderFrames.length || 1),
                      defenderFrames
                    ),
                  }}
                  style={[styles.defender, { opacity: animation }]}
                />
              </View>
            </View>
          </View>
        </ThemedView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    width: "100%",
    height: "100%",
  },
  wrapper: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    backgroundColor: "white",
    padding: 40,
    height: "100%",
  },
  frameWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "90%",
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
    height: "50%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
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
    resizeMode: "contain", // Maintain aspect ratio
  },
  defenderWrapper: {
    width: "40%",
    height: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
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
    resizeMode: "contain", // Maintain aspect ratio
    transform: [{ scaleX: -1 }],
  },
});

export default AttackTab;
