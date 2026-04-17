import type { AllGameData, AllPlayer } from '../types/liveClient';
import { playerItemsValue } from './goldCalc';

export interface OpponentMatchup {
  me: AllPlayer | null;
  opponent: AllPlayer | null;
  myItemsValue: number;
  opponentItemsValue: number;
  diff: number;
  leading: boolean;
}

export function findDirectOpponent(data: AllGameData): OpponentMatchup {
  const me = data.allPlayers.find((p) => p.summonerName === data.activePlayer.summonerName) ?? null;

  if (!me || !me.position) {
    return {
      me,
      opponent: null,
      myItemsValue: 0,
      opponentItemsValue: 0,
      diff: 0,
      leading: true,
    };
  }

  const opponent =
    data.allPlayers.find((p) => p.team !== me.team && p.position === me.position) ?? null;

  const myItemsValue = playerItemsValue(me);
  const opponentItemsValue = opponent ? playerItemsValue(opponent) : 0;

  return {
    me,
    opponent,
    myItemsValue,
    opponentItemsValue,
    diff: myItemsValue - opponentItemsValue,
    leading: myItemsValue >= opponentItemsValue,
  };
}
