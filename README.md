# BattleThread FE

BattleThread FE is a dynamic, interactive application that combines QR-based gameplay and stats-based mechanics to create a unique battle simulation experience. Players engage in battles using wearable Threads (QR codes), forming guilds, leveling up, and merging Threads to gain power.

## Installation

1.  Install dependencies:

    Copy code

    `npm install`

2.  Start the app:

    sql

    Copy code

    `npx expo start --clear`

Options to open the app:

- Development build
- Android emulator
- iOS simulator
- Expo Go

Edit files in the **app** directory. This project uses file-based routing.

## Features

- **QR-Based Combat (Threads Battle)**: Scan Threads to initiate battles. RNG and player levels determine outcomes.
- **Level Progression**: Gain experience by attacking, being attacked, or visiting partner locations.
- **Threads Merging**: Merge Threads to strengthen a target, unlock abilities, or boost stats.
- **Guild System**: Create or join guilds for coordinated battles and rewards.
- **Geographic Integration**: Earn experience by visiting partner locations (e.g., food chains, malls).
- **Hidden Strength**: Player stats are hidden, making battles unpredictable.

## Battle System Mechanics

- **Key Stats**: Attack, defense, dodge chance, critical chance, agility, health.
- **Damage Calculation**:
  1.  Dodge Check: Determine if attack misses.
  2.  Base Damage: Calculate using attack stat and random variation.
  3.  Critical Hit: Apply critical multiplier if triggered.
  4.  Defense Reduction: Subtract defender’s defense.
  5.  Health Update: Reduce defender’s health.
- **Special Abilities**: Include special attacks and healing.
