export interface Stats {
  attack: number;
  defense: number;
  criticalChance: number; // Percentage chance for critical hit (0-100)
  criticalDamageModifier: number; // Percentage modifier for critical damage
  dodgeChance: number; // Percentage chance for dodge (0-100)
  level: number;
  agility: number; // Influence dodge chance
  health: number; // Add health for tracking health during battle
}

export interface Avatar {
  username: string;
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
  range?: string[];
}

// Interface for a collection of character sprites
export interface CharacterSprites {
  [characterName: string]: ActionSprites; // Keyed by character name
}

// Position interface for animation placement
export interface Position {
  x: number;
  y: number;
}
