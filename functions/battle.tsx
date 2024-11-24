import { Avatar } from "@/types/avatar";

// Helper function to generate a random integer
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate critical hit chance based on the character's criticalChance stat
const getCriticalChance = (character: Avatar) => {
  return getRandomInt(1, 100) <= character.stats.criticalChance;
};

// Calculate dodge chance based on the character's dodgeChance stat
const getDodgeChance = (defender: Avatar) => {
  // Add defender's agility to their dodge chance for a more dynamic effect
  const dodgeChance = defender.stats.dodgeChance + defender.stats.agility;
  return getRandomInt(1, 100) <= dodgeChance;
};

// Calculate damage considering stats, level, RNG, and critical damage modifier
export const calculateDamage = (attacker: Avatar, defender: Avatar): number => {
  // Step 1: Check if the defender dodges the attack
  if (getDodgeChance(defender)) {
    console.log(`${defender.username} dodged the attack!`);
    return 0; // No damage dealt if dodged
  }

  // Step 2: Calculate base damage based on attacker's attack stat
  const baseDamage = getRandomInt(
    attacker.stats.attack - 5,
    attacker.stats.attack + 5
  );

  // Step 3: Check for critical hit chance and apply critical damage modifier
  const isCriticalHit = getCriticalChance(attacker);
  const criticalMultiplier = isCriticalHit
    ? 1 + attacker.stats.criticalDamageModifier / 100
    : 1; // Apply modifier if critical hit

  // Step 4: Calculate total damage
  const totalDamage = baseDamage * criticalMultiplier;

  // Step 5: Calculate damage reduction based on defender's defense stat
  const damageAfterDefense = totalDamage - defender.stats.defense;

  // Ensure the damage doesn't go below zero
  return Math.max(damageAfterDefense, 0);
};

// Handle an attack, update health, and check if the opponent is still alive
const attack = (attacker: Avatar, defender: Avatar) => {
  console.log(`${attacker.username} is attacking ${defender.username}`);

  // Calculate damage to defender
  const damage = calculateDamage(attacker, defender);

  // Subtract damage from defender's health
  defender.stats.health -= damage;

  // Check if defender is still alive
  if (defender.stats.health <= 0) {
    return `${defender.username} has been defeated! ${attacker.username} wins.`;
  }

  // If defender is alive, they retaliate
  const retaliateMessage = retaliate(defender, attacker);
  return `${damage} damage dealt\n${retaliateMessage}`;
};

// Handle retaliation (the opponent counterattacks after being attacked)
const retaliate = (defender: Avatar, attacker: Avatar) => {
  console.log(
    `${defender.username} is retaliating against ${attacker.username}`
  );

  // Calculate damage for retaliation
  const retaliationDamage = calculateDamage(defender, attacker);

  // Subtract retaliation damage from attacker's health
  attacker.stats.health -= retaliationDamage;

  // Check if attacker is still alive
  if (attacker.stats.health <= 0) {
    return `${attacker.username} has been defeated! ${defender.username} wins.`;
  }

  return `${retaliationDamage} retaliation damage\n${attacker.username} survives the counterattack.`;
};

// Example special attack function
const specialAttack = (attacker: Avatar, defender: Avatar) => {
  console.log(
    `${attacker.username} is using a special attack on ${defender.username}`
  );
  const baseDamage = getRandomInt(
    attacker.stats.attack + 10,
    attacker.stats.attack + 20
  );
  const damageMessage = calculateDamage(attacker, defender);
  const damage = calculateDamage(attacker, defender);

  // Subtract damage from defender's health
  defender.stats.health -= damage;

  // Check if defender is still alive
  if (defender.stats.health <= 0) {
    return `${defender.username} has been defeated! ${attacker.username} wins.`;
  }

  return `${damageMessage} (Special Attack)`;
};

// Heal function (restores health)
const heal = (character: Avatar) => {
  console.log(`${character.username} is healing!`);
  const healingAmount = getRandomInt(5, 15); // Healing between 5 and 15 HP
  character.stats.health += healingAmount;
  return `${character.username} heals for ${healingAmount} HP!`;
};

export { attack, retaliate, specialAttack, heal };