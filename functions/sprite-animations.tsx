import { spriteManifest } from "@/lib/spriteManifest";
import { AvatarAction, LoadedFrames } from "@/types/avatar";
import { Asset } from "expo-asset";
import FastImage from "react-native-fast-image";

export const loadFrames = (
  avatarId: string,
  action: AvatarAction
): string[] | undefined => {
  const framesForAvatar = spriteManifest[avatarId];
  if (!framesForAvatar) {
    console.warn(`No sprite manifest found for avatarId: ${avatarId}`);
    return undefined;
  }

  const framesForAction = framesForAvatar[action];
  if (!framesForAction) {
    console.warn(
      `No frames found for action: ${action} in avatarId: ${avatarId}`
    );
    return undefined;
  }

  return framesForAction;
};

export const getFrameWithFallback = (
  frames: string[],
  currentFrame: number,
  idleFrames: string[]
): string => {
  return frames[currentFrame] || idleFrames[0] || ""; // Default to the first idle frame
};

// Preload all frames for an avatar
export const preloadFrames = async (
  avatarId: string
): Promise<Record<AvatarAction, string[]>> => {
  const frames = spriteManifest[avatarId];

  // Return empty frames if no data found for the avatarId
  if (!frames) {
    console.error(`No frames found for Avatar ID: ${avatarId}`);
    return {
      die: [],
      hit: [],
      idle: [],
      attack: [],
      walk: [],
      run: [],
      shoot: [],
    };
  }

  const preloadedFrames: Record<AvatarAction, string[]> = {
    die: [],
    hit: [],
    idle: [],
    attack: [],
    run: [],
    walk: [],
    shoot: [],
  };

  await Promise.all(
    Object.entries(frames).map(async ([action, framePaths]) => {
      const actionKey = action as AvatarAction;
      preloadedFrames[actionKey] = [];

      try {
        const assets = await Promise.all(
          framePaths.map((frame) => Asset.fromModule(frame).downloadAsync())
        );

        preloadedFrames[actionKey] = assets.map((asset) => asset.uri);
      } catch (error) {
        console.warn(
          `Failed to preload some frames for action ${actionKey} of Avatar ID: ${avatarId}`,
          error
        );
      }
    })
  );

  return preloadedFrames;
};

export const preloadActionFrames = async (
  avatarId: string,
  action: AvatarAction
): Promise<string[]> => {
  const frames = spriteManifest[avatarId]?.[action];

  if (!frames || frames.length === 0) {
    console.error(
      `No frames found for Avatar ID: ${avatarId}, Action: ${action}`
    );
    return [];
  }

  const preloadedFrames: string[] = [];

  await Promise.all(
    frames.map(async (frame, index) => {
      try {
        const asset = Asset.fromModule(frame);
        await asset.downloadAsync();
        preloadedFrames.push(asset.uri); // Use the URI after preload
      } catch (error) {
        console.warn(
          `Failed to preload frame ${index} for action ${action}:`,
          error
        );
      }
    })
  );

  return preloadedFrames;
};

export const preloadFramesWithCache = async (
  avatarId: string
): Promise<Record<AvatarAction, string[]>> => {
  const frames = spriteManifest[avatarId];

  if (!frames) {
    console.error(`No frames found for Avatar ID: ${avatarId}`);
    return {
      die: [],
      hit: [],
      idle: [],
      attack: [],
      run: [],
      walk: [],
      shoot: [],
    };
  }

  const preloadedFrames: Record<AvatarAction, string[]> = {
    die: [],
    hit: [],
    idle: [],
    attack: [],
    run: [],
    walk: [],
    shoot: [],
  };

  for (const action of Object.keys(frames) as AvatarAction[]) {
    try {
      preloadedFrames[action] = await Promise.all(
        frames[action].map(async (frame) => {
          const asset = Asset.fromModule(frame);
          await asset.downloadAsync();
          FastImage.preload([{ uri: asset.uri }]); // Preload with FastImage
          return asset.uri;
        })
      );
    } catch (error) {
      console.error(
        `Error preloading ${action} frames for Avatar ID ${avatarId}`,
        error
      );
    }
  }

  return preloadedFrames;
};
