import { ALGORITHM, type Audit, type Config, type Reading, type RowAudit, type FlagCode } from './types.ts';
export function validateConfig(c: Config): void {
  if (!c || Object.keys(c).sort().join(',') !== 'flatMinutes,flatTolerance,intervalMinutes,max,min,modelThreshold,rate,spike') throw new Error('The check settings are incomplete.');
  if (Object.values(c).some(v => typeof v !== 'number' || !Number.isFinite(v))) throw new Error('Every check setting must be a finite number.');
  if (c.min >= c.max || c.min < -1e6 || c.max > 1e6 || c.spike <= 0 || c.spike > 100 || c.rate <= 0 || c.rate > 1000 || c.flatMinutes < 6 || c.flatMinutes > 1440 || c.flatTolerance < 0 || c.flatTolerance > 1 || c.intervalMinutes !== 6 || c.modelThreshold < .5 || c.modelThreshold > 1) throw new Error('Check settings are outside the supported range.');
}
const round = (n: number) => Math.round(n * 1e6) / 1e6;
function median(a: number[]) { const s = [...a].sort((a, b) => a - b); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; }
function expectedPath(n: number): number { if (n < 2) return 0; let h = 0; for (let i = 1; i < n; i++) h += 1 / i; return 2 * h - 2 * (n - 1) / n; }
type Tree = { n: number; feature?: number; split?: number; left?: Tree; right?: Tree };
function rng(seed: number) { let state = seed >>> 0; return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; }; }
export function isolationForest(points: number[][], trees = 64, sampleLimit = 128, seed = 73129): number[] {
  if (points.length < 16) return points.map(() => 0);
  const random = rng(seed), size = Math.min(sampleLimit, points.length), limit = Math.ceil(Math.log2(size));
  const grow = (p: number[][], depth: number): Tree => {
    if (p.length <= 1 || depth >= limit) return { n: p.length };
    const ranges = [0, 1, 2, 3].map(j => ({ j, lo: Math.min(...p.map(x => x[j])), hi: Math.max(...p.map(x => x[j])) })).filter(r => r.hi > r.lo);
    if (!ranges.length) return { n: p.length };
    const { j, lo, hi } = ranges[Math.floor(random() * ranges.length)];
    const split = lo + random() * (hi - lo), left = p.filter(x => x[j] < split), right = p.filter(x => x[j] >= split);
    return { n: p.length, feature: j, split, left: grow(left, depth + 1), right: grow(right, depth + 1) };
  };
  const forest: Tree[] = [];
  for (let i = 0; i < trees; i++) { const indices = points.map((_, j) => j); for (let j = 0; j < size; j++) { const k = j + Math.floor(random() * (points.length - j)); [indices[j], indices[k]] = [indices[k], indices[j]]; } forest.push(grow(indices.slice(0, size).map(j => points[j]), 0)); }
  const path = (t: Tree, p: number[], d = 0): number => t.feature === undefined ? d + expectedPath(t.n) : path(p[t.feature] < t.split! ? t.left! : t.right!, p, d + 1);
  return points.map(p => round(2 ** (-forest.reduce((sum, t) => sum + path(t, p), 0) / trees / expectedPath(size))));
}
export function analyze(readings: Reading[], config: Config): Audit {
  validateConfig(config);
  const rows: RowAudit[] = readings.map(r => ({ rowId: r.id, flags: [], score: null }));
  const add = (i: number, code: FlagCode, label: string, detail: string) => { if (!rows[i].flags.some(f => f.code === code)) rows[i].flags.push({ code, label, detail }); };
  const seen = new Map<number, number>();
  let flatStart = 0;
  for (let i = 0; i < readings.length; i++) {
    const r = readings[i], p = readings[i - 1], n = readings[i + 1];
    if (r.value === null) add(i, 'missing', 'Missing value', 'This row has a time but no water-level value.');
    if (seen.has(r.ms)) add(i, 'duplicate', 'Repeated time', `This time also appears on row ${seen.get(r.ms)! + 1}.`); else seen.set(r.ms, i);
    if (p) {
      const dt = (r.ms - p.ms) / 60000;
      if (dt < 0) add(i, 'order', 'Time out of order', 'This reading comes before the previous row. Original row order has been kept.');
      if (dt > config.intervalMinutes * 1.5) add(i, 'gap', 'Gap before reading', `${round(dt)} minutes since the previous row; expected ${config.intervalMinutes}.`);
      if (dt > 0 && p.value !== null && r.value !== null && Math.abs(r.value - p.value) / dt * 60 > config.rate) add(i, 'rate', 'Fast change', `${round(Math.abs(r.value - p.value) / dt * 60)} m/hour; review threshold ${config.rate}.`);
    }
    if (r.value !== null) {
      if (r.value < config.min || r.value > config.max) add(i, 'range', 'Outside chosen range', `${r.value} m is outside ${config.min} to ${config.max} m. Check the local datum and context.`);
      if (p?.value !== null && p && n?.value !== null && n && p.ms < r.ms && r.ms < n.ms && Math.abs(r.value - (p.value + n.value) / 2) > config.spike && (r.value - p.value) * (r.value - n.value) > 0) add(i, 'spike', 'Isolated spike', `Differs from the mean of its neighbours by ${round(Math.abs(r.value - (p.value + n.value) / 2))} m.`);
    }
    if (!p || r.value === null || p.value === null || Math.abs(r.value - readings[flatStart].value!) > config.flatTolerance || r.ms - p.ms !== config.intervalMinutes * 60000) flatStart = i;
    const endsFlat = !n || n.value === null || r.value === null || Math.abs(n.value - readings[flatStart].value!) > config.flatTolerance || n.ms - r.ms !== config.intervalMinutes * 60000;
    if (endsFlat && r.value !== null && r.ms - readings[flatStart].ms >= config.flatMinutes * 60000) add(i, 'flat', 'Long flat stretch', `${i - flatStart + 1} readings changed by no more than ${config.flatTolerance} m over ${round((r.ms - readings[flatStart].ms) / 60000)} minutes, starting at row ${flatStart + 1}.`);
  }
  const usable = readings.map((r, i) => ({ r, i })).filter(x => x.r.value !== null);
  const features = usable.map(({ r, i }) => {
    const neighbours = readings.slice(Math.max(0, i - 4), i + 5).filter(x => x.value !== null).map(x => x.value!);
    const prev = readings[i - 1];
    const delta = prev?.value !== null && prev ? Math.abs(r.value! - prev.value) : 0;
    const dt = prev ? Math.abs(r.ms - prev.ms) / 3600000 : 0;
    return [r.value!, Math.abs(r.value! - median(neighbours)), delta, dt > 0 ? delta / dt : 0].map(round);
  });
  if (usable.length >= 16) isolationForest(features).forEach((score, j) => { const i = usable[j].i; rows[i].score = score; if (score >= config.modelThreshold) add(i, 'model', 'Unusual pattern', `Isolation Forest score ${score.toFixed(3)} meets the review threshold ${config.modelThreshold}. This is a relative anomaly score, not a probability of error.`); });
  return { algorithm: ALGORITHM, rows, model: { name: 'Isolation Forest', trees: 64, sampleSize: Math.min(128, usable.length), seed: 73129, available: usable.length >= 16 }, summary: { readings: readings.length, flagged: rows.filter(r => r.flags.length).length, flags: rows.reduce((n, r) => n + r.flags.length, 0) } };
}
