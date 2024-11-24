import { spriteFrames } from "@/lib/sprites";
import { ActionSprites, Position } from "@/types/avatar";
import { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import Canvas, {
  CanvasRenderingContext2D,
  Image as CanvasImage,
} from "react-native-canvas"; // Import CanvasImage from react-native-canvas
import { Asset } from "expo-asset";

export async function loadCharacterSprites(
  characterName: string,
  actions: (keyof ActionSprites)[],
  basePath: string = "@assets/sprites"
): Promise<ActionSprites> {
  const characterSprites: ActionSprites = {
    die: [],
    hit: [],
    idle: [],
    attack: [],
    run: [],
    walk: [],
    range: [],
  };

  // Load the sprite frames for each action
  for (const action of actions) {
    const frames = spriteFrames[action]; // Replace with your `spriteFrames` object

    if (frames) {
      // Use `Asset.fromModule` to load images as assets
      characterSprites[action] = frames.map((frameUri) => {
        // Instead of using downloadAsync, directly load the asset
        const asset = Asset.fromModule(
          require(`${basePath}/${characterName}/${action}/${frameUri}.png`)
        );

        return asset.localUri || ""; // Return the local URI if available
      });
    } else {
      console.warn(`No frames found for action: ${action}`);
    }
  }

  return characterSprites;
}

// export function animateCharacter(
//   canvas: Canvas, // Accept canvas instead of ctx directly
//   sprites: ActionSprites,
//   action: keyof ActionSprites,
//   frameRate: number = 100,
//   position: Position = { x: 200, y: 200 }
// ): void {
//   let currentFrame = 0;

//   // Randomize "attack" or "shoot"
//   const selectedAction: keyof ActionSprites =
//     action === "attack"
//       ? Math.random() < 0.5 && sprites.range.length > 0
//         ? "range"
//         : "attack"
//       : action;

//   function loop() {
//     const ctx = canvas.getContext("2d"); // Get 2d context from canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

//     const frames = sprites[selectedAction];
//     if (frames.length > 0) {
//       const frameUri = frames[currentFrame];

//       // Create an image using CanvasImage and set the src
//       const img = new CanvasImage(canvas); // Pass canvas to constructor
//       img.src = frameUri; // Set the source to the frame URI

//       img.addEventListener("load", () => {
//         // Draw the image onto the canvas when it's fully loaded
//         ctx.drawImage(img, position.x, position.y);
//         currentFrame = (currentFrame + 1) % frames.length; // Cycle through frames
//       });

//       img.addEventListener("error", (err) => {
//         console.error("Image load failed", err);
//       });
//     }

//     // Recursively call to animate (at frameRate delay)
//     setTimeout(() => requestAnimationFrame(loop), frameRate);
//   }

//   loop();
// }

export const CharacterCanvas = ({
  characterName,
}: {
  characterName: string;
}) => {
  const [characterSprites, setCharacterSprites] =
    useState<ActionSprites | null>(null);

  useEffect(() => {
    // Load the sprite frames when the component mounts
    const actions: (keyof ActionSprites)[] = ["idle", "attack", "run"]; // Add other actions as needed

    loadCharacterSprites(characterName, actions)
      .then((sprites) => {
        setCharacterSprites(sprites); // Update state with the loaded sprite frames
      })
      .catch((error) => {
        console.error("Error loading character sprites:", error);
      });
  }, [characterName]); // Re-run this effect when characterName changes

  if (!characterSprites) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    ); // Show loading state while sprites are being loaded
  }

  return (
    <View>
      {/* Pass characterSprites to AnimatedCharacter once it's loaded */}
      <AnimatedCharacter sprites={characterSprites} action="idle" />
    </View>
  );
};

export function AnimatedCharacter({
  sprites,
  action,
  frameRate = 100,
  position = { x: 200, y: 200 },
}: {
  sprites: ActionSprites;
  action: keyof ActionSprites;
  frameRate?: number;
  position?: Position;
}) {
  const canvasRef = useRef<Canvas | null>(null); // Create a ref for Canvas

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d"); // Get context from canvas

    if (!ctx) return;

    let currentFrame = 0;

    // Randomize "attack" or "shoot"
    const selectedAction: keyof ActionSprites =
      action === "attack"
        ? Math.random() < 0.5 && sprites.range && sprites.range.length > 0
          ? "range"
          : "attack"
        : action;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      const frames = sprites[selectedAction];
      if (frames && frames.length > 0) {
        const frameUri = frames[currentFrame];

        // Create an image using CanvasImage and set the src
        const img = new CanvasImage(canvas); // Pass canvas to constructor
        img.src = frameUri; // Set the source to the frame URI

        img.addEventListener("load", () => {
          // Draw the image onto the canvas when it's fully loaded
          ctx.drawImage(img, position.x, position.y);
          currentFrame = (currentFrame + 1) % frames.length; // Cycle through frames
        });

        img.addEventListener("error", (err) => {
          console.error("Image load failed", err);
        });
      }

      // Recursively call to animate (at frameRate delay)
      setTimeout(() => requestAnimationFrame(loop), frameRate);
    }

    loop(); // Start the animation loop

    return () => {
      // Cleanup if necessary
    };
  }, [sprites, action, frameRate, position]);

  return (
    <View>
      <Canvas ref={canvasRef} />
    </View>
  );
}
