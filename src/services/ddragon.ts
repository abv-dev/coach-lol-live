const DDRAGON_VERSION = '16.7.1';
const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

const CHAMPION_NAME_FIX: Record<string, string> = {
  Wukong: 'MonkeyKing',
  'Nunu & Willump': 'Nunu',
  'Renata Glasc': 'Renata',
  "Kai'Sa": 'Kaisa',
  "Kha'Zix": 'Khazix',
  "Vel'Koz": 'Velkoz',
  "Cho'Gath": 'Chogath',
  "Kog'Maw": 'KogMaw',
  "Rek'Sai": 'RekSai',
  'Dr. Mundo': 'DrMundo',
  'Jarvan IV': 'JarvanIV',
  'Lee Sin': 'LeeSin',
  'Master Yi': 'MasterYi',
  'Miss Fortune': 'MissFortune',
  'Twisted Fate': 'TwistedFate',
  'Aurelion Sol': 'AurelionSol',
  'Tahm Kench': 'TahmKench',
  'Xin Zhao': 'XinZhao',
};

export function championSquareUrl(rawName: string): string {
  const fixed = CHAMPION_NAME_FIX[rawName] ?? rawName.replace(/['\s]/g, '');
  return `${DDRAGON_BASE}/${DDRAGON_VERSION}/img/champion/${fixed}.png`;
}

export function championSplashUrl(rawName: string): string {
  const fixed = CHAMPION_NAME_FIX[rawName] ?? rawName.replace(/['\s]/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${fixed}_0.jpg`;
}

export function itemIconUrl(itemId: number | string): string {
  return `${DDRAGON_BASE}/${DDRAGON_VERSION}/img/item/${itemId}.png`;
}
