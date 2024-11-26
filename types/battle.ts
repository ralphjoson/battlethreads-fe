import { Avatar } from "./avatar";

export interface BattleActions {
  attacker: Avatar;
  defender: Avatar;
  damageDealt: number;
  attackerHealth: number;
  defenderHealth: number;
  isCritical: boolean;
  isDodged: boolean;
}

export interface BattleOutcome {
  winner: Avatar;
  loser: Avatar;
  numberOfTurns: number;
  actions: BattleActions[];
}
