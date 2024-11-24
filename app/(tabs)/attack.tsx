import React, { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/core";
import { ThemedView } from "@/components/ThemedView";
import { createSpriteAnimations } from "@/functions/helper";
import { Sprites, type SpritesMethods } from "react-native-sprites";

const AttackTab = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [opponentData, setOpponentData] = useState<any>(null);
  const spriteRef = useRef<any>(null);
  const animations = createSpriteAnimations(38948, 1324, 27, 1, 1391, 1324);
  // Example frame data

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermissions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setOpponentData(null);
    }, [])
  );

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarcodeScanned = (event: { data: string; type: string }) => {
    try {
      const parsedData = JSON.parse(event.data);
      setOpponentData(parsedData);
      spriteRef.current.play("attack", {
        loop: true,
        resetAfterFinish: true,
        onFinish: () => {
          console.log("Animation finished");
        },
      });
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

  return (
    <>
      {!opponentData && (
        <ThemedView style={styles.frame}>
          <ThemedView style={styles.frameWrapper}>
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={handleBarcodeScanned}
              onCameraReady={() => console.log("Camera is ready")}
              onMountError={handleMountError}
              facing="back"
            />
          </ThemedView>
        </ThemedView>
      )}
      {opponentData && (
        <ThemedView style={styles.wrapper}>
          <Text>Opponent detected! Animating...</Text>
          <View style={styles.spriteContainer}>
            <Sprites
              ref={spriteRef}
              source={require("@assets/sprites/1/attack.png")} // Make sure the path is correct
              columns={28} // Assuming the sprite sheet has 28 columns
              rows={1} // Assuming all frames are in 1 row
              animations={{
                attack: { row: 0, startFrame: 0, endFrame: 26 },
              }} // Use the generated animations
            />
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
    width: 100,
    height: 100,
  },
});

export default AttackTab;
