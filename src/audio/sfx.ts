/**
 * 効果音。**波形はその場で作る。音のファイルは持たない。**
 *
 * GBA の音は矩形波と三角波の数チャンネルで、鐘も打撃もそこから作られている。
 * WebAudio の発振器はそれと同じことができるので、素材を置かずに済む。
 *
 * AudioContext は最初の操作まで止められている（ブラウザの自動再生規制）ので、
 * 鳴らそうとした時点で起こす。ゲームは必ずキーかタップを経てから戦闘に入るため、
 * 実際には最初の一音から鳴る。
 */

let ctx: AudioContext | undefined;
/** 全部の音がここを通る。音量を一箇所で握れるし、まとめて拾える */
let master: GainNode | undefined;
let tap: MediaStreamAudioDestinationNode | undefined;
let on = true;

export function setSfx(enabled: boolean) {
  on = enabled;
}

function audio(): AudioContext | undefined {
  if (!on) return undefined;
  try {
    ctx ??= new AudioContext();
  } catch {
    return undefined;
  }
  if (!master) {
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function out(): AudioNode | undefined {
  audio();
  return master;
}

/**
 * 効果音のバスを MediaStream として取り出す。録画に音を乗せるための口で、
 * ゲーム本体は使わない。
 */
export function sfxStream(): MediaStream | undefined {
  const a = audio();
  if (!a || !master) return undefined;
  if (!tap) {
    tap = a.createMediaStreamDestination();
    master.connect(tap);
  }
  return tap.stream;
}

interface ToneOpts {
  /** 周波数 (Hz) */
  hz: number;
  /** 長さ (秒) */
  len: number;
  type?: OscillatorType;
  gain?: number;
  /** 立ち上がり。0 だとプチッと鳴るので少しだけ持たせる */
  attack?: number;
  /** 終わりの周波数。下げるとチュンと落ちる */
  toHz?: number;
  delay?: number;
}

function tone(a: AudioContext, o: ToneOpts) {
  const t0 = a.currentTime + (o.delay ?? 0);
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.hz, t0);
  if (o.toHz) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.toHz), t0 + o.len);
  const peak = o.gain ?? 0.18;
  const atk = o.attack ?? 0.004;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.len);
  osc.connect(g).connect(out() ?? a.destination);
  osc.start(t0);
  osc.stop(t0 + o.len + 0.02);
}

/** 短い雑音。打撃の「ドッ」を作るのに使う */
function noise(a: AudioContext, len: number, gain: number, hz: number) {
  const n = Math.floor(a.sampleRate * len);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
  const src = a.createBufferSource();
  src.buffer = buf;
  const lp = a.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = hz;
  const g = a.createGain();
  g.gain.value = gain;
  src
    .connect(lp)
    .connect(g)
    .connect(out() ?? a.destination);
  src.start();
}

/** ペンタトニック。段を上がるほど高くなるので、続けて鳴らすと上へ伸びて聞こえる */
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const noteHz = (step: number) => 523.25 * 2 ** (SCALE[Math.min(step, SCALE.length - 1)] / 12);

/**
 * レベルアップで能力が一つ上がるたびの「ピン」。
 * step を増やすほど高くなるので、上がった数だけ音が積み上がる。
 */
export function statPing(step: number) {
  const a = audio();
  if (!a) return;
  const hz = noteHz(step);
  tone(a, { hz, len: 0.34, type: 'triangle', gain: 0.16 });
  tone(a, { hz: hz * 2, len: 0.2, type: 'sine', gain: 0.05 });
}

/** 上がりきったあとの締め。三度と五度を重ねる */
export function levelUpChord() {
  const a = audio();
  if (!a) return;
  for (const [i, m] of [0, 4, 7, 12].entries()) {
    tone(a, { hz: 523.25 * 2 ** (m / 12), len: 0.85, type: 'triangle', gain: 0.11, delay: i * 0.045 });
  }
}

/** 通常の一撃 */
export function hitSound(effective = false) {
  const a = audio();
  if (!a) return;
  noise(a, 0.12, effective ? 0.3 : 0.22, effective ? 2600 : 1800);
  tone(a, { hz: 180, toHz: 80, len: 0.14, type: 'square', gain: 0.1 });
}

/** 必殺。低く重い一発に金属の芯を混ぜる */
export function critSound() {
  const a = audio();
  if (!a) return;
  noise(a, 0.3, 0.4, 3600);
  tone(a, { hz: 140, toHz: 46, len: 0.42, type: 'square', gain: 0.16 });
  tone(a, { hz: 1400, toHz: 620, len: 0.3, type: 'triangle', gain: 0.09, delay: 0.01 });
}

/** 外した音。空を切る */
export function missSound() {
  const a = audio();
  if (!a) return;
  noise(a, 0.16, 0.1, 5200);
}
