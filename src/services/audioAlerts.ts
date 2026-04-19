import type { AllGameData } from '../types/liveClient';
import { computeObjectives } from '../logic/objectiveTimer';

const triggered = new Set<string>();
const STORAGE_KEY = 'coach-lol-live:audio-enabled';
let audioEnabled: boolean = (() => {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage?.getItem(STORAGE_KEY);
  return stored === null ? true : stored === '1';
})();

interface ObjectivePlan {
  name: string;
  key: string;
  inSeconds: number | null;
  now: number;
}

export function isAudioEnabled(): boolean {
  return audioEnabled;
}

export function setAudioEnabled(v: boolean): void {
  audioEnabled = v;
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem(STORAGE_KEY, v ? '1' : '0');
    if (!v && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

function speak(text: string): void {
  if (!audioEnabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'fr-FR';
  msg.rate = 1.05;
  msg.pitch = 1.0;
  msg.volume = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find((v) => v.lang.startsWith('fr'));
  if (fr) msg.voice = fr;

  window.speechSynthesis.speak(msg);
}

export function resetAudioAlerts(): void {
  triggered.clear();
}

export function checkAudioAlerts(data: AllGameData): void {
  if (typeof window === 'undefined') return;

  const obj = computeObjectives(data);
  const now = data.gameData.gameTime;

  const plans: ObjectivePlan[] = [
    { name: 'Drake',  key: 'drake',  inSeconds: obj.nextDragonIn, now },
    { name: 'Baron',  key: 'baron',  inSeconds: obj.nextBaronIn, now },
    { name: 'Herald', key: 'herald', inSeconds: obj.nextHeraldIn, now },
    { name: 'Grubs',  key: 'grubs',  inSeconds: obj.nextGrubsIn, now },
  ];

  for (const p of plans) {
    if (p.inSeconds === null || p.inSeconds < 0) continue;

    const spawnTime = Math.round(now + p.inSeconds);

    // 30s avant spawn
    if (p.inSeconds <= 30 && p.inSeconds >= 28) {
      const id = `${p.key}-30-${spawnTime}`;
      if (!triggered.has(id)) {
        triggered.add(id);
        speak(`${p.name} dans 30 secondes`);
      }
    }

    // au spawn (fenêtre 0-2s pour être sûr de matcher un tick)
    if (p.inSeconds >= 0 && p.inSeconds <= 1) {
      const id = `${p.key}-up-${spawnTime}`;
      if (!triggered.has(id)) {
        triggered.add(id);
        speak(`${p.name} disponible`);
      }
    }
  }
}
