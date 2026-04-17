import type { AllGameData } from '../types/liveClient';
import type { Alert } from '../types/alert';
import { findDirectOpponent } from './directOpponent';
import { computeObjectives, formatTime } from './objectiveTimer';

export function computeAlerts(data: AllGameData): Alert[] {
  const alerts: Alert[] = [];
  const me = data.allPlayers.find((p) => p.summonerName === data.activePlayer.summonerName);

  const hp = data.activePlayer.championStats.currentHealth;
  const maxHp = data.activePlayer.championStats.maxHealth;
  const hpPct = maxHp > 0 ? Math.round((hp / maxHp) * 100) : 0;

  if (hpPct < 25 && hpPct > 0) {
    alerts.push({ id: 'hp-critical', level: 'critical', text: `HP ${hpPct}%` });
  }

  const mana = data.activePlayer.championStats.resourceValue;
  const maxMana = data.activePlayer.championStats.resourceMax;
  if (maxMana > 0) {
    const manaPct = Math.round((mana / maxMana) * 100);
    const rtype = data.activePlayer.championStats.resourceType;
    if (manaPct < 20 && (rtype === 'MANA' || rtype === 'ENERGY')) {
      alerts.push({ id: 'mana-low', level: 'warn', text: `${rtype} ${manaPct}%` });
    }
  }

  const gold = data.activePlayer.currentGold;
  if (gold >= 2000) {
    alerts.push({ id: 'gold-stash', level: 'info', text: `${gold}g en bourse` });
  }

  for (const p of data.allPlayers) {
    if (p.team === me?.team) continue;
    if (p.isDead && p.respawnTimer > 0) {
      alerts.push({
        id: `dead-${p.summonerName}`,
        level: 'info',
        text: `${p.championName} dead · ${Math.ceil(p.respawnTimer)}s`,
      });
    }
  }

  const obj = computeObjectives(data);
  if (obj.nextDragonIn < 60 && obj.nextDragonIn > 0) {
    alerts.push({
      id: 'drake-soon',
      level: obj.nextDragonIn < 30 ? 'warn' : 'info',
      text: `Drake ${formatTime(obj.nextDragonIn)}`,
    });
  }
  if (obj.nextBaronIn < 60 && obj.nextBaronIn > 0) {
    alerts.push({
      id: 'baron-soon',
      level: obj.nextBaronIn < 30 ? 'warn' : 'info',
      text: `Baron ${formatTime(obj.nextBaronIn)}`,
    });
  }
  if (obj.nextHeraldIn !== null && obj.nextHeraldIn < 60 && obj.nextHeraldIn > 0) {
    alerts.push({
      id: 'herald-soon',
      level: 'info',
      text: `Herald ${formatTime(obj.nextHeraldIn)}`,
    });
  }
  if (obj.nextDragonIn === 0) alerts.push({ id: 'drake-up', level: 'warn', text: 'Drake UP' });
  if (obj.nextBaronIn === 0) alerts.push({ id: 'baron-up', level: 'warn', text: 'Baron UP' });

  const matchup = findDirectOpponent(data);
  if (matchup.opponent && Math.abs(matchup.diff) >= 1500) {
    const sign = matchup.diff > 0 ? '+' : '';
    alerts.push({
      id: 'items-duel',
      level: 'info',
      text: `${sign}${Math.round(matchup.diff)} items vs ${matchup.opponent.championName}`,
    });
  }

  const order = { critical: 0, warn: 1, info: 2 };
  alerts.sort((a, b) => order[a.level] - order[b.level]);
  return alerts;
}
