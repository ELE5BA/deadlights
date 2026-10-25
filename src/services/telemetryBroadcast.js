/**
 * Cross-window broadcast helper for Deadlights arcade booth telemetry.
 * Allows the game window and standalone admin dashboard window to communicate seamlessly.
 */

const CHANNEL_NAME = 'deadlights_telemetry';

export function broadcastRunEvent(detail = {}) {
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: 'SESSION_COMPLETED', timestamp: Date.now(), detail });
      channel.close();
    } catch {
      // BroadcastChannel unavailable or restricted
    }
  }
}

export function subscribeTelemetryEvents(callback) {
  if (typeof BroadcastChannel === 'undefined') return () => {};
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const handler = (event) => {
      if (event.data?.type === 'SESSION_COMPLETED') {
        callback(event.data);
      }
    };
    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
  } catch {
    return () => {};
  }
}
