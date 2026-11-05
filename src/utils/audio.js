// Web Audio API Divine Synthesizer for ZEUS GYM
// Pure mathematical synthesis: Zero external media dependencies, instant offline performance

let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Synthesizes and plays divine acoustic sound effects for Zeus Gym
 * @param {'success'|'warning'|'error'|'alert'|'door'|'thunder'|'lightning_strike'|'olympus_chime'} type
 */
export function playSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // =========================================================================
    // 1. SUCCESS: Celestial Harmonious Triad (Acceso Concedido)
    // Warm, uplifting sine triad (D5 -> F#5 -> A5) with gentle acoustic envelope
    // =========================================================================
    if (type === 'success') {
      const frequencies = [587.33, 739.99, 880.00]; // D5, F#5, A5
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.04 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 0.55);
      });

    // =========================================================================
    // 2. WARNING: Amber Presage Chime (Membresía por vencer)
    // Soft, distinct dual-tone pulse (E5 -> B4) with smooth triangle harmonics
    // =========================================================================
    } else if (type === 'warning') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.setValueAtTime(493.88, now + 0.15); // B4

      osc2.frequency.setValueAtTime(329.63, now); // E4 sub
      osc2.frequency.setValueAtTime(246.94, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.48);
      osc2.stop(now + 0.48);

    // =========================================================================
    // 3. ERROR: Sacred Denial Tone (Acceso Denegado / Vencido)
    // Controlled low-mid acoustic drop (180Hz -> 110Hz) with soft clipping
    // Firm and authoritative, but not an ear-piercing harsh screech
    // =========================================================================
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(185, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

    // =========================================================================
    // 4. ALERT: Olympus Decree Broadcast (Aviso Oficial / Decreto)
    // Crystalline double chime (A5 -> E6) resonant ping
    // =========================================================================
    } else if (type === 'alert') {
      [880, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.6);
      });

    // =========================================================================
    // 5. DOOR / PORTAL: Sacred Gate Turnstile Pulse (Apertura Relé)
    // Subtle magnetic pulse and soft high tick
    // =========================================================================
    } else if (type === 'door') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);

    // =========================================================================
    // 6. THUNDER: Low-Frequency Divine Rumble (Trueno de Zeus)
    // Filtered noise buffer + deep sub-bass oscillator
    // =========================================================================
    } else if (type === 'thunder') {
      // Sub-bass rumble osc
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(75, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.3);

      // Noise generator for thunder texture
      const bufferSize = ctx.sampleRate * 1.2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 1.2);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 1.2);

    // =========================================================================
    // 7. LIGHTNING_STRIKE: High-voltage Electric Discharge (Rayo de Zeus)
    // Instant fast pitch plunge + crackle + resonant tail
    // =========================================================================
    } else if (type === 'lightning_strike') {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.28);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);

      // Low resonant aftershock
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(120, now + 0.05);
      boom.frequency.exponentialRampToValueAtTime(40, now + 0.6);

      boomGain.gain.setValueAtTime(0.2, now + 0.05);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      boom.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start(now + 0.05);
      boom.stop(now + 0.6);

    // =========================================================================
    // 8. OLYMPUS_CHIME: Celestial Shimmering Chime (Pase de Visita / Rayo Veloz)
    // Pentatonic crystal harmonics (F#5, G#5, C#6, D#6) with glowing decay
    // =========================================================================
    } else if (type === 'olympus_chime') {
      const chimeNotes = [739.99, 830.61, 1108.73, 1244.51];
      chimeNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.85);
      });
    }
  } catch (e) {
    console.warn('[Zeus Audio] Web Audio error:', e);
  }
}

export default playSound;
