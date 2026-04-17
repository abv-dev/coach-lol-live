import type { AllGameData } from '../types/liveClient';
import { generateMockGameState, tickMockGame } from '../mock/gameState';

const LIVE_ENDPOINT = '/liveclientdata/allgamedata';

export type ConnectionState = 'connected' | 'no-game' | 'mock' | 'error';

export interface LiveClientResult {
  state: ConnectionState;
  data: AllGameData | null;
  error?: string;
}

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function fetchViaTauri(): Promise<LiveClientResult> {
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const data = await invoke<AllGameData>('fetch_live_game_data');
    return { state: 'connected', data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'NO_GAME' || msg.includes('NO_GAME')) {
      return { state: 'no-game', data: null };
    }
    return { state: 'error', data: null, error: msg };
  }
}

async function fetchViaVite(): Promise<LiveClientResult> {
  try {
    const res = await fetch(LIVE_ENDPOINT, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(1500),
    });
    if (res.status === 404) return { state: 'no-game', data: null };
    if (!res.ok) return { state: 'error', data: null, error: `HTTP ${res.status}` };
    const data = (await res.json()) as AllGameData;
    return { state: 'connected', data };
  } catch (err) {
    return {
      state: 'error',
      data: null,
      error: err instanceof Error ? err.message : 'unknown',
    };
  }
}

export async function fetchLiveData(): Promise<LiveClientResult> {
  return isTauri() ? fetchViaTauri() : fetchViaVite();
}

let mockState: AllGameData = generateMockGameState();

export function fetchMockData(): LiveClientResult {
  mockState = tickMockGame(mockState);
  return { state: 'mock', data: mockState };
}

export function resetMock(): void {
  mockState = generateMockGameState();
}
