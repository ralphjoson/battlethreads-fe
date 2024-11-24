# BattleThread FE

BattleThread FE is a dynamic battle simulation application that utilizes stats-based mechanics, such as attack, defense, dodge chance, and critical hits, to determine the outcome of battles. Players engage in tactical turn-based combat where each action is influenced by character stats, abilities, and chance.

## Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start --clear
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Battle System Mechanics

The battle system in this project incorporates several key stats and factors that influence the outcome of each attack. Below are the details on how damage is calculated, including stats, chances for critical hits, and dodging:

### Key Stats:

- **Attack**: Determines the base power of an attack.
- **Defense**: Reduces incoming damage based on the defender's defense stat.
- **Critical Chance**: The chance for an attack to deal double damage (critical hit).
- **Dodge Chance**: The chance for a defender to avoid an attack entirely.
- **Agility**: Affects the dodge chance. It’s added to the defender's dodge chance stat for more dynamic results.
- **Health**: The amount of health the character has. This is reduced when they take damage.

### Damage Calculation:

1. **Dodge Chance**: The first step in the battle calculation is to check if the defender dodges the attack. This is determined by the defender’s **dodgeChance** and **agility**. If the dodge is successful, the attack misses, and no damage is dealt.
2. **Base Damage**: If the defender does not dodge, the base damage is calculated using the attacker's **attack** stat. This base damage is adjusted by a small random range to introduce some variability.
3. **Critical Hit**: After the base damage is calculated, we check for a critical hit. If the attacker's **criticalChance** is triggered (based on a random roll), the damage is multiplied by a **criticalMultiplier**, usually 2x. This multiplier is adjustable based on the attacker's stats (e.g., adding **criticalDamageModifier**).
4. **Defense Reduction**: The calculated damage is then reduced by the defender’s **defense** stat. The final damage is the result after this reduction, ensuring that the damage cannot go below zero.

### Example Code Flow:

1. **Attack Phase**: The attacker performs an attack, and the damage is calculated based on their stats and the defender's stats.
2. **Retaliation Phase**: If the defender survives, they retaliate with their own calculated damage.
3. **Health Update**: The defender's health is reduced by the damage dealt, and if it falls below zero, they are considered defeated.

### Special Abilities:

- **Special Attacks**: Characters can use special attacks that deal extra damage. The exact calculation may vary depending on the ability.
- **Healing**: Characters can heal themselves, restoring a set amount of health.
