import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/core";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, AvatarAction } from "@/types/avatar";
import { battleOutcome } from "@/functions/battle";

const AttackTab = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [opponentData, setOpponentData] = useState<any>(null);
  const [attackerCurrentFrame, setAttackerCurrentFrame] = useState(0);
  const [defendercurrentFrame, setDefenderCurrentFrame] = useState(0);
  const animation = useRef(new Animated.Value(1)).current;
  const [attackerAction, setAttackerAction] = useState<AvatarAction>("idle");
  const [attackerFrames, setAttackerFrames] = useState<[]>([]);
  const [defenderAction, setDefenderAction] = useState<AvatarAction>("idle");
  const [defenderFrames, setDefenderFrames] = useState<[]>([]);

  // Sample battle outcome function
  const attacker: Avatar = {
    username: "Attacker",
    avatarId: "1",
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
    avatarId: "1",
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

  useEffect(() => {}, [attackerAction]);

  // Array of individual sprite frames
  const idleFrames = useMemo(
    () => [
      require("@assets/sprites/1/idle/0.png"),
      require("@assets/sprites/1/idle/1.png"),
      require("@assets/sprites/1/idle/2.png"),
      require("@assets/sprites/1/idle/3.png"),
      require("@assets/sprites/1/idle/4.png"),
      require("@assets/sprites/1/idle/5.png"),
      require("@assets/sprites/1/idle/6.png"),
      require("@assets/sprites/1/idle/7.png"),
      require("@assets/sprites/1/idle/8.png"),
      require("@assets/sprites/1/idle/9.png"),
      require("@assets/sprites/1/idle/10.png"),
      require("@assets/sprites/1/idle/11.png"),
      require("@assets/sprites/1/idle/12.png"),
      require("@assets/sprites/1/idle/13.png"),
      require("@assets/sprites/1/idle/14.png"),
      require("@assets/sprites/1/idle/15.png"),
      require("@assets/sprites/1/idle/16.png"),
      require("@assets/sprites/1/idle/17.png"),
    ],
    []
  );

  const attackFrames = useMemo(
    () => [
      require("@assets/sprites/1/attack/0.png"),
      require("@assets/sprites/1/attack/1.png"),
      require("@assets/sprites/1/attack/2.png"),
      require("@assets/sprites/1/attack/3.png"),
      require("@assets/sprites/1/attack/4.png"),
      require("@assets/sprites/1/attack/5.png"),
      require("@assets/sprites/1/attack/6.png"),
      require("@assets/sprites/1/attack/7.png"),
      require("@assets/sprites/1/attack/8.png"),
      require("@assets/sprites/1/attack/9.png"),
      require("@assets/sprites/1/attack/10.png"),
      require("@assets/sprites/1/attack/11.png"),
      require("@assets/sprites/1/attack/12.png"),
      require("@assets/sprites/1/attack/13.png"),
      require("@assets/sprites/1/attack/14.png"),
      require("@assets/sprites/1/attack/15.png"),
      require("@assets/sprites/1/attack/16.png"),
      require("@assets/sprites/1/attack/17.png"),
      require("@assets/sprites/1/attack/18.png"),
      require("@assets/sprites/1/attack/19.png"),
      require("@assets/sprites/1/attack/20.png"),
      require("@assets/sprites/1/attack/21.png"),
      require("@assets/sprites/1/attack/22.png"),
      require("@assets/sprites/1/attack/23.png"),
      require("@assets/sprites/1/attack/24.png"),
      require("@assets/sprites/1/attack/25.png"),
      require("@assets/sprites/1/attack/26.png"),
      require("@assets/sprites/1/attack/27.png"),
    ],
    []
  );

  const runFrames = useMemo(
    () => [
      require("@assets/sprites/1/run/0.png"),
      require("@assets/sprites/1/run/1.png"),
      require("@assets/sprites/1/run/2.png"),
      require("@assets/sprites/1/run/3.png"),
      require("@assets/sprites/1/run/4.png"),
      require("@assets/sprites/1/run/5.png"),
      require("@assets/sprites/1/run/6.png"),
      require("@assets/sprites/1/run/7.png"),
      require("@assets/sprites/1/run/8.png"),
      require("@assets/sprites/1/run/9.png"),
      require("@assets/sprites/1/run/10.png"),
      require("@assets/sprites/1/run/11.png"),
      require("@assets/sprites/1/run/12.png"),
    ],
    []
  );

  const hitFrames = useMemo(
    () => [
      require("@assets/sprites/1/hit/0.png"),
      require("@assets/sprites/1/hit/1.png"),
      require("@assets/sprites/1/hit/2.png"),
      require("@assets/sprites/1/hit/3.png"),
      require("@assets/sprites/1/hit/4.png"),
      require("@assets/sprites/1/hit/5.png"),
      require("@assets/sprites/1/hit/6.png"),
    ],
    []
  );

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermissions();

    const interval = setInterval(() => {
      setAttackerCurrentFrame(
        (prevFrame) => (prevFrame + 1) % idleFrames.length
      );
    }, 30);

    // showBattlePreview();
    return () => clearInterval(interval);
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

  const showBattlePreview = () => {
    // Set attacker action to attack
    setAttackerAction("attack");
    setAttackerFrames(attackFrames);
    // Set defender action to hit
    setDefenderAction("hit");
    setDefenderFrames(hitFrames);

    // Animate the battle
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1, // Animate to full opacity
        duration: 1000, // Animate over 1 second
        useNativeDriver: true, // Use native driver for performance
      }),
      Animated.timing(animation, {
        toValue: 0, // Animate to no opacity
        duration: 1000, // Animate over 1 second
        useNativeDriver: true, // Use native driver for performance
      }),
    ]).start(() => {
      // Reset animation to 1 for next battle
      animation.setValue(1);
    });
  };

  // useEffect(() => {
  //   showBattlePreview();
  // }, [attackFrames, hitFrames]);

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
          <Text>Opponent detected! Animating...</Text>
          <View style={styles.spriteContainer}>
            <View className="attacker" style={[styles.attackerWrapper]}>
              <View style={[styles.attackerContainer]}>
                <Animated.Image
                  source={attackerFrames[attackerCurrentFrame]} // Display current frame
                  style={[styles.attacker, { opacity: animation }]}
                />
              </View>
            </View>
            <View className="defender" style={[styles.defenderWrapper]}>
              <View style={[styles.defenderContainer]}>
                <Animated.Image
                  source={idleFrames[attackerCurrentFrame]} // Display current frame
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
