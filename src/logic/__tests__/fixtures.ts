import type { AllGameData, AllPlayer, GameEvent } from '../../types/liveClient';

function makePlayer(overrides: Partial<AllPlayer> = {}): AllPlayer {
  return {
    championName: 'Ornn',
    rawChampionName: 'Ornn',
    summonerName: 'Player1',
    riotId: 'Player1#EUW',
    team: 'ORDER',
    level: 1,
    position: 'TOP',
    isBot: false,
    isDead: false,
    respawnTimer: 0,
    items: [],
    scores: { kills: 0, deaths: 0, assists: 0, creepScore: 0, wardScore: 0 },
    summonerSpells: {
      summonerSpellOne: { displayName: 'Flash', rawDescription: '' },
      summonerSpellTwo: { displayName: 'Ignite', rawDescription: '' },
    },
    skinID: 0,
    ...overrides,
  };
}

export function makeGameData(overrides: Partial<AllGameData> = {}): AllGameData {
  const allPlayers: AllPlayer[] = [
    makePlayer({ summonerName: 'You',      championName: 'Ornn',    team: 'ORDER', position: 'TOP',     level: 11, scores: { kills: 3, deaths: 1, assists: 4, creepScore: 124, wardScore: 5 } }),
    makePlayer({ summonerName: 'JgAlly',   championName: 'LeeSin',  team: 'ORDER', position: 'JUNGLE',  level: 10 }),
    makePlayer({ summonerName: 'MidAlly',  championName: 'Ahri',    team: 'ORDER', position: 'MIDDLE',  level: 11 }),
    makePlayer({ summonerName: 'AdcAlly',  championName: 'Jinx',    team: 'ORDER', position: 'BOTTOM',  level: 10 }),
    makePlayer({ summonerName: 'SupAlly',  championName: 'Leona',   team: 'ORDER', position: 'UTILITY', level: 9 }),
    makePlayer({ summonerName: 'TopEnemy', championName: 'Darius',  team: 'CHAOS', position: 'TOP',     level: 9,  scores: { kills: 1, deaths: 3, assists: 0, creepScore: 98, wardScore: 2 } }),
    makePlayer({ summonerName: 'JgEnemy',  championName: 'Graves',  team: 'CHAOS', position: 'JUNGLE',  level: 10 }),
    makePlayer({ summonerName: 'MidEnemy', championName: 'Yasuo',   team: 'CHAOS', position: 'MIDDLE',  level: 10 }),
    makePlayer({ summonerName: 'AdcEnemy', championName: 'Caitlyn', team: 'CHAOS', position: 'BOTTOM',  level: 9 }),
    makePlayer({ summonerName: 'SupEnemy', championName: 'Thresh',  team: 'CHAOS', position: 'UTILITY', level: 8 }),
  ];

  return {
    activePlayer: {
      summonerName: 'You',
      riotId: 'You#EUW',
      level: 11,
      currentGold: 2148,
      championStats: {
        currentHealth: 892, maxHealth: 1140, resourceValue: 180, resourceMax: 400,
        resourceType: 'MANA', armor: 74, magicResist: 54, attackDamage: 102,
        abilityPower: 0, attackSpeed: 0.72, moveSpeed: 345,
      },
      abilities: {
        Q: { id: 'OrnnQ', displayName: 'Q', abilityLevel: 4 },
        W: { id: 'OrnnW', displayName: 'W', abilityLevel: 2 },
        E: { id: 'OrnnE', displayName: 'E', abilityLevel: 2 },
        R: { id: 'OrnnR', displayName: 'R', abilityLevel: 2 },
      },
      fullRunes: null,
      teamRelativeColors: false,
    },
    allPlayers,
    events: { Events: [{ EventID: 0, EventName: 'GameStart', EventTime: 0 }] },
    gameData: { gameMode: 'CLASSIC', gameTime: 700, mapName: 'Map11', mapNumber: 11, mapTerrain: 'Default' },
    ...overrides,
  };
}

export function withEvents(data: AllGameData, events: GameEvent[]): AllGameData {
  return { ...data, events: { Events: [...data.events.Events, ...events] } };
}

export function withItem(data: AllGameData, summoner: string, itemID: number, price: number, slot: number): AllGameData {
  return {
    ...data,
    allPlayers: data.allPlayers.map((p) =>
      p.summonerName === summoner
        ? {
            ...p,
            items: [...p.items, { itemID, slot, count: 1, price, canUse: false, consumable: false, displayName: `#${itemID}` }],
          }
        : p,
    ),
  };
}
