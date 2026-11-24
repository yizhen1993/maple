// Web Audio API procedural sound synthesizer for MapleStory 3D
(function () {
  const MapleAudio = {};
  let ctx = null;
  let bgmPlaying = false;
  let bgmInterval = null;
  let isMuted = false;

  function getCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  // Jump sound: cheerful upward pitch sweep
  MapleAudio.playJump = function () {
    if (isMuted) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    const now = c.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  };

  // Sword slash whoosh
  MapleAudio.playAttack = function () {
    if (isMuted) return;
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime;

    // Filtered noise for whoosh
    const bufferSize = c.sampleRate * 0.1;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = c.createBufferSource();
    noise.buffer = buffer;

    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.1);
    filter.Q.value = 3.0;

    const gain = c.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);

    noise.start(now);
    noise.stop(now + 0.11);
  };

  // Monster hit squish sound
  MapleAudio.playHit = function (isCrit) {
    if (isMuted) return;
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = isCrit ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(isCrit ? 440 : 280, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    gain.gain.setValueAtTime(isCrit ? 0.35 : 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  };

  // Meso coin pickup chime
  MapleAudio.playCoin = function () {
    if (isMuted) return;
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime;

    const osc1 = c.createOscillator();
    const osc2 = c.createOscillator();
    const gain = c.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.07); // E6

    osc2.frequency.setValueAtTime(1975.53, now); // B6
    osc2.frequency.setValueAtTime(2637.02, now + 0.07); // E7

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(c.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  };

  // Level Up fanfare: classic Maple arpeggio
  MapleAudio.playLevelUp = function () {
    if (isMuted) return;
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime;

    // Arpeggio notes: C5, E5, G5, C6, E6, G6
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      const t = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  };

  // Rope climbing small step
  MapleAudio.playClimb = function () {
    if (isMuted) return;
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  };

  // Procedural Henesys-style nostalgic background music
  // Gentle, uplifting acoustic chime & flute vibe
  const melody = [
    { note: 523.25, dur: 0.25 }, // C5
    { note: 659.25, dur: 0.25 }, // E5
    { note: 783.99, dur: 0.35 }, // G5
    { note: 880.00, dur: 0.25 }, // A5
    { note: 783.99, dur: 0.5 },  // G5
    { note: 659.25, dur: 0.35 }, // E5
    { note: 587.33, dur: 0.25 }, // D5
    { note: 523.25, dur: 0.6 },  // C5
    { note: 440.00, dur: 0.25 }, // A4
    { note: 523.25, dur: 0.25 }, // C5
    { note: 587.33, dur: 0.35 }, // D5
    { note: 659.25, dur: 0.4 },  // E5
    { note: 587.33, dur: 0.6 }   // D5
  ];

  let currentNoteIdx = 0;

  function playBgmNote() {
    if (!bgmPlaying || isMuted) return;
    const c = getCtx();
    if (!c) return;

    const item = melody[currentNoteIdx];
    currentNoteIdx = (currentNoteIdx + 1) % melody.length;

    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(item.note, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.002, now + item.dur * 0.95);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + item.dur);

    bgmInterval = setTimeout(playBgmNote, item.dur * 1000);
  }

  MapleAudio.startBgm = function () {
    if (bgmPlaying) return;
    bgmPlaying = true;
    currentNoteIdx = 0;
    playBgmNote();
  };

  MapleAudio.stopBgm = function () {
    bgmPlaying = false;
    if (bgmInterval) clearTimeout(bgmInterval);
  };

  MapleAudio.toggleMute = function () {
    isMuted = !isMuted;
    if (isMuted) MapleAudio.stopBgm();
    else MapleAudio.startBgm();
    return isMuted;
  };

  MapleAudio.isMuted = function () {
    return isMuted;
  };

  window.MapleAudio = MapleAudio;
})();
