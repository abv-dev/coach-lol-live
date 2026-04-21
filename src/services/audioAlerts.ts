import type { AllGameData, Team } from '../types/liveClient';
import { computeObjectives } from '../logic/objectiveTimer';
import { computeDragonState } from '../logic/dragonSoul';
import { getAudioConfig } from './audioConfig';
import { getLang } from '../i18n';

const triggered = new Set<string>();

type ObjKey = 'drake' | 'baron' | 'herald' | 'grubs';

interface ObjectivePlan {
  name: string;
  key: ObjKey;
  scheduledAt: number | null;
}

const names: Record<Lang, Record<ObjKey, string>> = {
  fr: { drake: 'Drake', baron: 'Baron', herald: 'Herald', grubs: 'Grubs' },
  en: { drake: 'Drake', baron: 'Baron', herald: 'Herald', grubs: 'Grubs' },
};

const soulTypes: Record<Lang, Record<string, string>> = {
  fr: {
    Infernal: 'infernale', Ocean: 'océan', Cloud: 'nuage',
    Mountain: 'montagne', Hextech: 'hextech', Chemtech: 'chemtech',
  },
  en: {
    Infernal: 'Infernal', Ocean: 'Ocean', Cloud: 'Cloud',
    Mountain: 'Mountain', Hextech: 'Hextech', Chemtech: 'Chemtech',
  },
};

const teamNames: Record<Lang, Record<Team, string>> = {
  fr: { ORDER: 'bleue', CHAOS: 'rouge' },
  en: { ORDER: 'blue', CHAOS: 'red' },
};

type Lang = 'fr' | 'en';

const phrases: Record<Lang, {
  soon: (name: string) => string;
  up: (name: string) => string;
  soul: (type: string, team: string) => string;
}> = {
  fr: {
    soon: (n) => `${n} dans 30 secondes`,
    up: (n) => `${n} disponible`,
    soul: (t, team) => `Âme ${t} pour l'équipe ${team}`,
  },
  en: {
    soon: (n) => `${n} in 30 seconds`,
    up: (n) => `${n} available`,
    soul: (t, team) => `${t} soul secured by ${team} team`,
  },
};

export function speak(text: string, opts?: { test?: boolean }): void {
  const config = getAudioConfig();
  if (!opts?.test && !config.enabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const lang = getLang();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
  msg.rate = 1.05;
  msg.pitch = 1.0;
  msg.volume = config.volume;

  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith(lang));
  if (voice) msg.voice = voice;

  window.speechSynthesis.speak(msg);
}

export function testAudio(): void {
  const lang = getLang();
  const sample = lang === 'fr' ? 'Test audio — Baron dans 30 secondes' : 'Audio test — Baron in 30 seconds';
  speak(sample, { test: true });
}

export function resetAudioAlerts(): void {
  triggered.clear();
}

export function checkAudioAlerts(data: AllGameData): void {
  if (typeof window === 'undefined') return;
  const config = getAudioConfig();
  if (!config.enabled) return;

  const obj = computeObjectives(data);
  const now = data.gameData.gameTime;
  const lang = getLang();
  const ph = phrases[lang];

  const plans: ObjectivePlan[] = [
    { name: names[lang].drake,  key: 'drake',  scheduledAt: obj.nextDragonAt },
    { name: names[lang].baron,  key: 'baron',  scheduledAt: obj.nextBaronAt },
    { name: names[lang].herald, key: 'herald', scheduledAt: obj.nextHeraldAt },
    { name: names[lang].grubs,  key: 'grubs',  scheduledAt: obj.nextGrubsAt },
  ];

  for (const p of plans) {
    if (p.scheduledAt === null) continue;
    if (!config[p.key]) continue;

    const remaining = p.scheduledAt - now;

    if (remaining > 27 && remaining <= 30) {
      const id = `${p.key}-soon-${p.scheduledAt}`;
      if (!triggered.has(id)) {
        triggered.add(id);
        speak(ph.soon(p.name));
      }
    }

    if (remaining <= 1 && remaining > -3) {
      const id = `${p.key}-up-${p.scheduledAt}`;
      if (!triggered.has(id)) {
        triggered.add(id);
        speak(ph.up(p.name));
      }
    }
  }

  // Dragon soul — announced once per game when a team secures 4 drakes
  if (config.drake) {
    const soul = computeDragonState(data);
    if (soul.soulTeam && soul.soulType) {
      const id = `soul-${soul.soulTeam}-${soul.soulType}`;
      if (!triggered.has(id)) {
        triggered.add(id);
        const typeLabel = soulTypes[lang][soul.soulType] ?? soul.soulType;
        speak(ph.soul(typeLabel, teamNames[lang][soul.soulTeam]));
      }
    }
  }
}
