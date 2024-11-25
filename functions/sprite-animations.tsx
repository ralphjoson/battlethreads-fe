import { spriteManifest } from "@/lib/spriteManifest";
import { AvatarAction, LoadedFrames } from "@/types/avatar";
import { Asset } from "expo-asset";

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
  console.log(`Preloading frames for Avatar ID: ${avatarId}`);
  const frames = spriteManifest[avatarId];

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

  const preloadedFrames: Record<AvatarAction, string[]> = {} as Record<
    AvatarAction,
    string[]
  >;

  for (const action of Object.keys(frames) as AvatarAction[]) {
    try {
      preloadedFrames[action] = [];
      console.log(`Preloading ${action} frames for Avatar ID: ${avatarId}`);
      await Promise.all(
        frames[action].map(async (frame, index) => {
          try {
            const asset = Asset.fromModule(frame);
            await asset.downloadAsync();
            preloadedFrames[action].push(asset.uri); // Use the URI after preload
            console.log(`Preloaded frame ${index}: ${asset.uri}`);
          } catch (error) {
            console.warn(
              `Failed to preload frame ${index} for action ${action}:`,
              error
            );
          }
        })
      );
    } catch (error) {
      console.warn(
        `Failed to preload ${action} for Avatar ID ${avatarId}`,
        error
      );
    }
  }

  console.log("Preloaded frames:", preloadedFrames);
  return preloadedFrames;
};
