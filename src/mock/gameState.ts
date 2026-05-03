import type { AllGameData, AllPlayer, GameEvent, Team, Position } from '../types/liveClient';

interface MockChamp {
  name: string;
  summoner: string;
  team: Team;
  position: Position;
  itemBuild: number[];
}

const LINEUP: MockChamp[] = [
  { name: 'Ornn',    summoner: 'You',        team: 'ORDER', position: 'TOP',     itemBuild: [3068, 3075, 3742, 3193, 3065] },
  { name: 'LeeSin',  summoner: 'JgDiff',     team: 'ORDER', position: 'JUNGLE',  itemBuild: [6630, 3047, 3071, 3075, 3193] },
  { name: 'Ahri',    summoner: 'MidAndy',    team: 'ORDER', position: 'MIDDLE',  itemBuild: [6655, 3020, 3285, 3116, 3135] },
  { name: 'Jinx',    summoner: 'HardCarry',  team: 'ORDER', position: 'BOTTOM',  itemBuild: [6672, 3006, 3094, 6675, 3026] },
  { name: 'Leona',   summoner: 'ShieldGuy',  team: 'ORDER', position: 'UTILITY', itemBuild: [3190, 3011, 3050, 3065, 3075] },
  { name: 'Darius',  summoner: 'TopAndy',    team: 'CHAOS', position: 'TOP',     itemBuild: [6630, 3071, 3053, 3075, 3065] },
  { name: 'Graves',  summoner: 'JgGap',      team: 'CHAOS', position: 'JUNGLE',  itemBuild: [6672, 3006, 3094, 6675, 3036] },
  { name: 'Yasuo',   summoner: 'ItsOver',    team: 'CHAOS', position: 'MIDDLE',  itemBuild: [6673, 3006, 3031, 3094, 3036] },
  { name: 'Caitlyn', summoner: 'PingLord',   team: 'CHAOS', position: 'BOTTOM',  itemBuild: [6672, 3006, 3094, 6676, 3036] },
  { name: 'Thresh',  summoner: 'HookMaster', team: 'CHAOS', position: 'UTILITY', itemBuild: [3190, 3011, 3050, 3117, 3065] },
];

const ITEM_PRICES: Record<number, number> = {
  6630: 3300, 6655: 3200, 6672: 3400, 6673: 3200, 6675: 3000, 6676: 3200,
  3068: 3200, 3075: 2900, 3047: 1100, 3071: 3300, 3094: 2600, 3116: 2650,
  3135: 3000, 3285: 3200, 3036: 3000, 3031: 3400, 3053: 3200, 3020: 1050,
  3190: 2400, 3011: 800,  3050: 2500, 3065: 2800, 3193: 2700, 3742: 2700,
  3117:  950, 3006: 1100, 3026: 3000,
};

// Pre-baked mid-game stats so the demo (and screen recordings) show a rich
// dashboard immediately instead of starting from 0:00.
const SEED_KDA: Array<{ k: number; d: number; a: number; cs: number }> = [
  { k: 3, d: 2, a: 4, cs: 120 }, // Ornn TOP
  { k: 2, d: 1, a: 4, cs: 95 },  // LeeSin JG
  { k: 2, d: 2, a: 3, cs: 145 }, // Ahri MID
  { k: 2, d: 2, a: 2, cs: 150 }, // Jinx ADC
  { k: 1, d: 2, a: 6, cs: 25 },  // Leona SUP
  { k: 3, d: 2, a: 1, cs: 110 }, // Darius TOP
  { k: 2, d: 2, a: 3, cs: 100 }, // Graves JG
  { k: 2, d: 3, a: 2, cs: 130 }, // Yasuo MID
  { k: 1, d: 1, a: 3, cs: 135 }, // Caitlyn ADC
  { k: 1, d: 2, a: 5, cs: 20 },  // Thresh SUP
];

const SEED_TIME = 920; // 15:20 — soul predicted, baron coming, herald gone

function buildSeedItems(idx: number): { itemID: number; slot: number; count: number; price: number; canUse: boolean; consumable: boolean; displayName: string }[] {
  const champ = LINEUP[idx]!;
  const seed = SEED_KDA[idx]!;
  const goldEarned = 500 + seed.cs * 21 + seed.k * 300 + seed.a * 150 + SEED_TIME * 21 * 0.45;
  const itemsTarget = Math.min(champ.itemBuild.length, Math.max(2, Math.floor(goldEarned / 3000)));
  return champ.itemBuild.slice(0, itemsTarget).map((itemID, slot) => ({
    itemID,
    slot,
    count: 1,
    price: ITEM_PRICES[itemID] ?? 0,
    canUse: false,
    consumable: false,
    displayName: `Item${itemID}`,
  }));
}

export function generateMockGameState(): AllGameData {
  const seedLevel = Math.min(18, Math.max(1, Math.floor(SEED_TIME / 60) + 1));
  const allPlayers: AllPlayer[] = LINEUP.map((champ, idx) => {
    const seed = SEED_KDA[idx]!;
    return {
      championName: champ.name,
      rawChampionName: `game_character_displayname_${champ.name}`,
      summonerName: champ.summoner,
      riotId: `${champ.summoner}#EUW`,
      team: champ.team,
      level: seedLevel,
      position: champ.position,
      isBot: false,
      isDead: false,
      respawnTimer: 0,
      items: buildSeedItems(idx),
      scores: { kills: seed.k, deaths: seed.d, assists: seed.a, creepScore: seed.cs, wardScore: 5 },
      summonerSpells: {
        summonerSpellOne: { displayName: 'Flash', rawDescription: '' },
        summonerSpellTwo: { displayName: idx === 0 ? 'Teleport' : idx === 1 ? 'Smite' : idx === 4 || idx === 9 ? 'Exhaust' : 'Ignite', rawDescription: '' },
      },
      skinID: 0,
    };
  });

  // Seed events covering up to SEED_TIME so timers, dragons, herald, turrets,
  // and the soul prediction (mapTerrain) are already meaningful.
  const seedEvents: GameEvent[] = [
    { EventID: 0, EventName: 'GameStart',    EventTime: 0 },
    { EventID: 1, EventName: 'FirstBlood',   EventTime: 180, KillerName: 'JgDiff' },
    { EventID: 2, EventName: 'ChampionKill', EventTime: 180, KillerName: 'JgDiff',    VictimName: 'TopAndy',   Assisters: ['You'] },
    { EventID: 3, EventName: 'DragonKill',   EventTime: 300, KillerName: 'JgDiff',    DragonType: 'Infernal' },
    { EventID: 4, EventName: 'ChampionKill', EventTime: 360, KillerName: 'You',       VictimName: 'TopAndy',   Assisters: ['JgDiff'] },
    { EventID: 5, EventName: 'TurretKilled', EventTime: 420, KillerName: 'You',       TurretKilled: 'Turret_T2_L_03_A' },
    { EventID: 6, EventName: 'ChampionKill', EventTime: 480, KillerName: 'TopAndy',   VictimName: 'JgDiff',    Assisters: ['ItsOver'] },
    { EventID: 7, EventName: 'HeraldKill',   EventTime: 540, KillerName: 'JgDiff' },
    { EventID: 8, EventName: 'ChampionKill', EventTime: 660, KillerName: 'MidAndy',   VictimName: 'ItsOver',   Assisters: ['HardCarry'] },
    { EventID: 9, EventName: 'ChampionKill', EventTime: 720, KillerName: 'PingLord',  VictimName: 'HardCarry', Assisters: ['ItsOver'] },
    { EventID: 10, EventName: 'DragonKill',  EventTime: 780, KillerName: 'JgGap',     DragonType: 'Ocean' },
    { EventID: 11, EventName: 'TurretKilled', EventTime: 900, KillerName: 'HardCarry', TurretKilled: 'Turret_T2_R_02_A' },
  ];

  const ornnItems = allPlayers[0]!.items;
  const ornnSpent = ornnItems.reduce((s, i) => s + i.price, 0);
  const ornnSeed = SEED_KDA[0]!;
  const ornnEarned = 500 + ornnSeed.cs * 21 + ornnSeed.k * 300 + ornnSeed.a * 150 + SEED_TIME * 21 * 0.45;

  return {
    activePlayer: {
      summonerName: 'You',
      riotId: 'You#EUW',
      level: seedLevel,
      currentGold: Math.max(0, Math.floor(ornnEarned - ornnSpent)),
      championStats: {
        currentHealth: 1820, maxHealth: 2400, resourceValue: 280, resourceMax: 1040,
        resourceType: 'MANA', armor: 124, magicResist: 86, attackDamage: 117,
        abilityPower: 0, attackSpeed: 0.78, moveSpeed: 335,
      },
      abilities: {
        Q: { id: 'OrnnQ', displayName: 'Volcanic Rupture',    abilityLevel: 5 },
        W: { id: 'OrnnW', displayName: 'Bellows Breath',      abilityLevel: 4 },
        E: { id: 'OrnnE', displayName: 'Searing Charge',      abilityLevel: 4 },
        R: { id: 'OrnnR', displayName: 'Call of the Forge God', abilityLevel: 2 },
      },
      fullRunes: null,
      teamRelativeColors: false,
    },
    allPlayers,
    events: { Events: seedEvents },
    gameData: {
      gameMode: 'CLASSIC',
      gameTime: SEED_TIME,
      mapName: 'Map11',
      mapNumber: 11,
      mapTerrain: 'Hextech',
    },
  };
}

function pickRandomEnemy(): string {
  const enemies = LINEUP.filter((c) => c.team === 'CHAOS');
  const chosen = enemies[Math.floor(Math.random() * enemies.length)];
  return chosen?.summoner ?? 'Enemy';
}

function pickRandomAlly(): string {
  const allies = LINEUP.filter((c) => c.team === 'ORDER');
  const chosen = allies[Math.floor(Math.random() * allies.length)];
  return chosen?.summoner ?? 'Ally';
}

export function tickMockGame(prev: AllGameData): AllGameData {
  const dt = 1;
  const time = prev.gameData.gameTime + dt;

  const expectedLevel = Math.min(18, Math.max(1, Math.floor(time / 60) + 1));
  const goldRate = 21;
  const csRate = 0.5 + Math.random() * 0.3;

  const allPlayers = prev.allPlayers.map((p, idx) => {
    const champ = LINEUP[idx]!;
    const cs = Math.floor(p.scores.creepScore + csRate);
    const goldEarned = 500 + cs * 21 + p.scores.kills * 300 + p.scores.assists * 150 + time * goldRate * 0.45;
    const itemsTarget = Math.min(champ.itemBuild.length, Math.floor(goldEarned / 3000));
    const items = champ.itemBuild.slice(0, itemsTarget).map((itemID, slot) => ({
      itemID,
      slot,
      count: 1,
      price: ITEM_PRICES[itemID] ?? 0,
      canUse: false,
      consumable: false,
      displayName: `Item${itemID}`,
    }));

    let newKills = p.scores.kills;
    let newAssists = p.scores.assists;
    let newDeaths = p.scores.deaths;
    let isDead = p.isDead;
    let respawnTimer = Math.max(0, p.respawnTimer - dt);

    if (respawnTimer === 0 && isDead) isDead = false;

    return {
      ...p,
      level: expectedLevel,
      items,
      isDead,
      respawnTimer,
      scores: { ...p.scores, creepScore: cs, kills: newKills, assists: newAssists, deaths: newDeaths },
    };
  });

  const killRoll = Math.random();
  let events: GameEvent[] = [...prev.events.Events];

  if (killRoll > 0.975 && time > 120) {
    const killerIdx = Math.floor(Math.random() * 10);
    let victimIdx = Math.floor(Math.random() * 10);
    while (LINEUP[victimIdx]?.team === LINEUP[killerIdx]?.team) {
      victimIdx = Math.floor(Math.random() * 10);
    }
    const killer = LINEUP[killerIdx]!;
    const victim = LINEUP[victimIdx]!;
    const victimPlayer = allPlayers[victimIdx]!;
    const killerPlayer = allPlayers[killerIdx]!;

    const hasFirstBlood = events.some((e) => e.EventName === 'FirstBlood');
    if (!hasFirstBlood) {
      events.push({ EventID: events.length, EventName: 'FirstBlood', EventTime: time, KillerName: killer.summoner });
    }

    events.push({
      EventID: events.length,
      EventName: 'ChampionKill',
      EventTime: time,
      KillerName: killer.summoner,
      VictimName: victim.summoner,
      Assisters: [],
    });

    allPlayers[killerIdx] = { ...killerPlayer, scores: { ...killerPlayer.scores, kills: killerPlayer.scores.kills + 1 } };
    allPlayers[victimIdx] = {
      ...victimPlayer,
      isDead: true,
      respawnTimer: 10 + expectedLevel * 2,
      scores: { ...victimPlayer.scores, deaths: victimPlayer.scores.deaths + 1 },
    };
  }

  if (time === 300) events.push({ EventID: events.length, EventName: 'DragonKill', EventTime: time, KillerName: pickRandomAlly(), DragonType: 'Infernal' });
  if (time === 420) events.push({ EventID: events.length, EventName: 'TurretKilled', EventTime: time, TurretKilled: 'Turret_T1_L_03_A', KillerName: pickRandomAlly() });
  if (time === 540) events.push({ EventID: events.length, EventName: 'HeraldKill', EventTime: time, KillerName: pickRandomAlly() });
  if (time === 780) events.push({ EventID: events.length, EventName: 'DragonKill', EventTime: time, KillerName: pickRandomEnemy(), DragonType: 'Mountain' });
  if (time === 900) events.push({ EventID: events.length, EventName: 'TurretKilled', EventTime: time, TurretKilled: 'Turret_T2_R_02_A', KillerName: pickRandomEnemy() });
  if (time === 1200) events.push({ EventID: events.length, EventName: 'BaronKill', EventTime: time, KillerName: pickRandomAlly() });

  const activePlayer = allPlayers[0]!;
  const activeSpent = activePlayer.items.reduce((s, i) => s + i.price, 0);
  const activeEarned = 500 + activePlayer.scores.creepScore * 21 + activePlayer.scores.kills * 300 + activePlayer.scores.assists * 150 + time * goldRate * 0.45;
  const currentGold = Math.max(0, Math.floor(activeEarned - activeSpent));

  const abilityLevels = Math.min(18, expectedLevel);
  const qLevel = Math.min(5, Math.ceil(abilityLevels / 3));
  const wLevel = Math.min(5, Math.floor(abilityLevels / 4));
  const eLevel = Math.min(5, Math.floor(abilityLevels / 4));
  const rLevel = abilityLevels >= 16 ? 3 : abilityLevels >= 11 ? 2 : abilityLevels >= 6 ? 1 : 0;

  const hpWave = 0.6 + Math.sin(time / 30) * 0.3;
  const maxHealth = 640 + expectedLevel * 110;
  const currentHealth = Math.max(1, Math.floor(maxHealth * Math.max(0.1, hpWave)));

  const manaWave = 0.5 + Math.sin(time / 18 + 1) * 0.35;
  const maxMana = 400 + expectedLevel * 40;
  const currentMana = Math.max(0, Math.floor(maxMana * Math.max(0.05, manaWave)));

  return {
    ...prev,
    activePlayer: {
      ...prev.activePlayer,
      level: expectedLevel,
      currentGold,
      championStats: {
        ...prev.activePlayer.championStats,
        currentHealth,
        maxHealth,
        resourceValue: currentMana,
        resourceMax: maxMana,
        attackDamage: 69 + expectedLevel * 3,
        armor: 30 + expectedLevel * 4,
        magicResist: 32 + expectedLevel * 2,
      },
      abilities: {
        Q: { ...prev.activePlayer.abilities.Q!, abilityLevel: qLevel },
        W: { ...prev.activePlayer.abilities.W!, abilityLevel: wLevel },
        E: { ...prev.activePlayer.abilities.E!, abilityLevel: eLevel },
        R: { ...prev.activePlayer.abilities.R!, abilityLevel: rLevel },
      },
    },
    allPlayers,
    events: { Events: events },
    gameData: { ...prev.gameData, gameTime: time },
  };
}
