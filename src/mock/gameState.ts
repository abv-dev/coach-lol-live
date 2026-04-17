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

export function generateMockGameState(): AllGameData {
  const allPlayers: AllPlayer[] = LINEUP.map((champ) => ({
    championName: champ.name,
    rawChampionName: `game_character_displayname_${champ.name}`,
    summonerName: champ.summoner,
    riotId: `${champ.summoner}#EUW`,
    team: champ.team,
    level: 1,
    position: champ.position,
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
  }));

  return {
    activePlayer: {
      summonerName: 'You',
      riotId: 'You#EUW',
      level: 1,
      currentGold: 500,
      championStats: {
        currentHealth: 640, maxHealth: 640, resourceValue: 400, resourceMax: 400,
        resourceType: 'MANA', armor: 30, magicResist: 32, attackDamage: 69,
        abilityPower: 0, attackSpeed: 0.625, moveSpeed: 335,
      },
      abilities: {
        Q: { id: 'OrnnQ', displayName: 'Volcanic Rupture',    abilityLevel: 0 },
        W: { id: 'OrnnW', displayName: 'Bellows Breath',      abilityLevel: 0 },
        E: { id: 'OrnnE', displayName: 'Searing Charge',      abilityLevel: 0 },
        R: { id: 'OrnnR', displayName: 'Call of the Forge God', abilityLevel: 0 },
      },
      fullRunes: null,
      teamRelativeColors: false,
    },
    allPlayers,
    events: { Events: [{ EventID: 0, EventName: 'GameStart', EventTime: 0 }] },
    gameData: {
      gameMode: 'CLASSIC',
      gameTime: 0,
      mapName: 'Map11',
      mapNumber: 11,
      mapTerrain: 'Default',
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
