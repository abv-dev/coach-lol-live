export type Team = 'ORDER' | 'CHAOS';
export type Position = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY' | 'NONE' | '';

export interface PlayerItem {
  itemID: number;
  slot: number;
  count: number;
  price: number;
  canUse: boolean;
  consumable: boolean;
  displayName: string;
}

export interface PlayerScores {
  kills: number;
  deaths: number;
  assists: number;
  creepScore: number;
  wardScore: number;
}

export interface SummonerSpells {
  summonerSpellOne: { displayName: string; rawDescription: string };
  summonerSpellTwo: { displayName: string; rawDescription: string };
}

export interface AllPlayer {
  championName: string;
  rawChampionName: string;
  summonerName: string;
  riotId: string;
  team: Team;
  level: number;
  position: Position;
  isBot: boolean;
  isDead: boolean;
  respawnTimer: number;
  items: PlayerItem[];
  scores: PlayerScores;
  summonerSpells: SummonerSpells;
  skinID: number;
}

export interface ChampionStats {
  currentHealth: number;
  maxHealth: number;
  resourceValue: number;
  resourceMax: number;
  resourceType: string;
  armor: number;
  magicResist: number;
  attackDamage: number;
  abilityPower: number;
  attackSpeed: number;
  moveSpeed: number;
}

export interface ActivePlayer {
  summonerName: string;
  riotId: string;
  level: number;
  currentGold: number;
  championStats: ChampionStats;
  abilities: Record<string, { id: string; displayName: string; abilityLevel: number }>;
  fullRunes: unknown;
  teamRelativeColors: boolean;
}

export interface GameEvent {
  EventID: number;
  EventName: string;
  EventTime: number;
  KillerName?: string;
  VictimName?: string;
  Assisters?: string[];
  DragonType?: string;
  Stolen?: string;
  TurretKilled?: string;
}

export interface GameData {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface AllGameData {
  activePlayer: ActivePlayer;
  allPlayers: AllPlayer[];
  events: { Events: GameEvent[] };
  gameData: GameData;
}
