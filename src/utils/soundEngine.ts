let audioCtx: AudioContext | null = null;
let isMuted = false;
let volumeScale = 1.0; // 0.0 to 1.0
let alarmOscillator: OscillatorNode | null = null;
let alarmGain: GainNode | null = null;
let alarmInterval: number | null = null;

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mottathala_sound_muted');
  if (stored === 'true') isMuted = true;
  const storedVol = localStorage.getItem('mottathala_alarm_volume');
  if (storedVol) volumeScale = Math.max(0, Math.min(100, Number(storedVol))) / 100;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEngine = {
  isMuted: () => isMuted,

  toggleMute: () => {
    isMuted = !isMuted;
    if (isMuted) {
      soundEngine.stopAlarm();
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('mottathala_sound_muted', String(isMuted));
    }
    return isMuted;
  },

  setVolume: (percent: number) => {
    volumeScale = Math.max(0, Math.min(100, percent)) / 100;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mottathala_alarm_volume', String(percent));
    }
  },

  getVolume: () => Math.round(volumeScale * 100),

  playBeep: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08 * volumeScale, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore autoplay policy
    }
  },

  // 🔴 POSITIVE EMERGENCY SIREN (High-pitch alternating alarm)
  playPositiveAlarm: () => {
    if (isMuted) return;
    soundEngine.stopAlarm(); // Clear any previous alarm

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);

      gain.gain.setValueAtTime(0.12 * volumeScale, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      alarmOscillator = osc;
      alarmGain = gain;

      // Siren pitch warble modulation
      let high = false;
      alarmInterval = window.setInterval(() => {
        if (!alarmOscillator || !audioCtx) return;
        high = !high;
        alarmOscillator.frequency.setValueAtTime(high ? 950 : 550, audioCtx.currentTime);
      }, 250);

    } catch {
      // Ignore
    }
  },

  // Backwards compatibility alias
  playAlarm: () => {
    soundEngine.playPositiveAlarm();
  },

  // 🟢 NEGATIVE EMERGENCY ALARM (Comedic descending bouncy alert sound)
  playNegativeAlarm: () => {
    if (isMuted) return;
    soundEngine.stopAlarm(); // Clear any previous alarm

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, ctx.currentTime);

      gain.gain.setValueAtTime(0.14 * volumeScale, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      alarmOscillator = osc;
      alarmGain = gain;

      // Pitch glide pattern: 500Hz -> 320Hz -> 180Hz comical wah-wah
      let step = 0;
      const pitches = [500, 380, 260, 420, 300, 180];
      alarmInterval = window.setInterval(() => {
        if (!alarmOscillator || !audioCtx) return;
        step = (step + 1) % pitches.length;
        alarmOscillator.frequency.exponentialRampToValueAtTime(pitches[step], audioCtx.currentTime + 0.15);
      }, 200);

    } catch {
      // Ignore
    }
  },

  stopAlarm: () => {
    if (alarmInterval) {
      clearInterval(alarmInterval);
      alarmInterval = null;
    }
    if (alarmOscillator) {
      try {
        alarmOscillator.stop();
        alarmOscillator.disconnect();
      } catch {}
      alarmOscillator = null;
    }
    if (alarmGain) {
      try {
        alarmGain.disconnect();
      } catch {}
      alarmGain = null;
    }
  },

  playFanfare: () => {
    if (isMuted) return;
    soundEngine.stopAlarm();
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.12 * volumeScale, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch {
      // Ignore
    }
  }
};

