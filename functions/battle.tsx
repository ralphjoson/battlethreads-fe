import { Avatar } from "@/types/avatar";

// Utility functions
const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getCriticalChance = (character: Avatar): boolean =>
  getRandomInt(1, 100) <= character.stats.criticalChance;

const getDodgeChance = (character: Avatar): boolean =>
  getRandomInt(1, 100) <= character.stats.dodgeChance + character.stats.agility;

// Core battle mechanics
export const calculateDamage = (attacker: Avatar, defender: Avatar): number => {
  if (getDodgeChance(defender)) return 0; // Dodged attack

  const baseDamage = getRandomInt(
    attacker.stats.attack - 5,
    attacker.stats.attack + 5
  );
  const isCriticalHit = getCriticalChance(attacker);
  const criticalMultiplier = isCriticalHit
    ? 1 + attacker.stats.criticalDamageModifier / 100
    : 1;

  const totalDamage = baseDamage * criticalMultiplier;
  const damageAfterDefense = totalDamage - defender.stats.defense;

  return Math.max(damageAfterDefense, 0); // No negative damage
};

const applyDamage = (
  attacker: Avatar,
  defender: Avatar,
  isCritical: boolean,
  isDodged: boolean,
  actions: any[]
): number => {
  const damage = isDodged ? 0 : calculateDamage(attacker, defender);
  defender.stats.health = Math.max(defender.stats.health - damage, 0);

  actions.push({
    attacker: attacker.id,
    defender: defender.id,
    damageDealt: damage,
    attackerHealth: attacker.stats.health,
    defenderHealth: defender.stats.health,
    isCritical,
    isDodged,
  });

  return damage;
};

const gainExperience = (character: Avatar, experienceGained: number): void => {
  character.stats.experience += experienceGained;
  const levelUpThreshold = 100;

  while (character.stats.experience >= levelUpThreshold) {
    character.stats.level++;
    character.stats.experience -= levelUpThreshold;
  }
};

// Main battle function
export const battleOutcome = (attacker: Avatar, defender: Avatar) => {
  const actions: {
    attacker: string;
    defender: string;
    damageDealt: number;
    attackerHealth: number;
    defenderHealth: number;
    isCritical: boolean;
    isDodged: boolean;
  }[] = [];

  let turns = 0;
  let winner: string | null = null;
  let loser: string | null = null;

  while (attacker.stats.health > 0 && defender.stats.health > 0) {
    turns++;

    // Attacker's turn
    const isCritical = getCriticalChance(attacker);
    const isDodged = getDodgeChance(defender);
    applyDamage(attacker, defender, isCritical, isDodged, actions);

    if (defender.stats.health <= 0) {
      winner = attacker.id;
      loser = defender.id;
      gainExperience(attacker, 50);
      break;
    }

    // Defender's turn
    const isDefenderCritical = getCriticalChance(defender);
    const isAttackerDodged = getDodgeChance(attacker);
    applyDamage(
      defender,
      attacker,
      isDefenderCritical,
      isAttackerDodged,
      actions
    );

    if (attacker.stats.health <= 0) {
      winner = defender.id;
      loser = attacker.id;
      gainExperience(defender, 50);
      break;
    }
  }

  return {
    winner,
    loser,
    numberOfTurns: turns,
    actions,
  };
};
