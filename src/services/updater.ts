export type UpdateStatus =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'none' }
  | { kind: 'available'; version: string }
  | { kind: 'downloading'; percent: number }
  | { kind: 'installing' }
  | { kind: 'error'; message: string };

export async function checkAndApplyUpdate(
  onStatus: (s: UpdateStatus) => void,
): Promise<void> {
  if (typeof window === 'undefined' || !('__TAURI_INTERNALS__' in window)) {
    return;
  }

  try {
    onStatus({ kind: 'checking' });
    const { check } = await import('@tauri-apps/plugin-updater');
    const update = await check();

    if (!update) {
      onStatus({ kind: 'none' });
      return;
    }

    onStatus({ kind: 'available', version: update.version });

    let downloaded = 0;
    let total = 0;

    await update.downloadAndInstall((event) => {
      if (event.event === 'Started') {
        total = event.data.contentLength ?? 0;
      } else if (event.event === 'Progress') {
        downloaded += event.data.chunkLength;
        const percent = total > 0 ? Math.round((downloaded / total) * 100) : 0;
        onStatus({ kind: 'downloading', percent });
      } else if (event.event === 'Finished') {
        onStatus({ kind: 'installing' });
      }
    });

    const { relaunch } = await import('@tauri-apps/plugin-process');
    await relaunch();
  } catch (err) {
    onStatus({
      kind: 'error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
