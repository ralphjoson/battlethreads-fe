export interface Stats {
  attack: number;
  defense: number;
  criticalChance: number; // Percentage chance for critical hit (0-100)
  criticalDamageModifier: number; // Percentage modifier for critical damage
  dodgeChance: number; // Percentage chance for dodge (0-100)
  level: number;
  agility: number; // Influence dodge chance
  health: number; // Add health for tracking health during battle
  experience: number; // Track experience points
}

export interface Avatar {
  username: string;
  avatarId: string;
  stats: Stats;
}

// Define an interface for individual actions
export interface ActionSprites {
  die: string[];
  hit: string[];
  idle: string[];
  attack?: string[];
  run?: string[];
  walk?: string[];
  shoot?: string[];
}

export type AvatarAction =
  | "die"
  | "hit"
  | "idle"
  | "attack"
  | "run"
  | "walk"
  | "shoot";

// Interface for a collection of character sprites
export interface CharacterSprites {
  [characterName: string]: ActionSprites; // Keyed by character name
}

// Position interface for animation placement
export interface Position {
  x: number;
  y: number;
}

// Frame Counts and Preload Interfaces
export type FrameCounts = Record<
  string, // Avatar ID as string
  Record<AvatarAction, number> // Action and corresponding frame count
>;

export interface LoadedFrames {
  [key: string]: string[]; // Optional because not all actions may have frames
}
