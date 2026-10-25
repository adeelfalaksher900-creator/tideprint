import { analyze, validateConfig } from './audit.ts';
import { parseCSV, csvCell } from './csv.ts';
import { MAX_BUNDLE_BYTES, type Audit, type Bundle, type Decision, type Draft, type Manifest, type Source } from './types.ts';
export function canonical(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') { if (!Number.isFinite(value)) throw new Error('A receipt cannot contain a non-finite number.'); return JSON.stringify(value); }
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical((value as Record<string, unknown>)[k])).join(',') + '}';
  throw new Error('The receipt contains an unsupported value.');
}
export async function sha256(text: string): Promise<string> { const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2, '0')).join(''); }
export function validateProofEncoding(proof:unknown):asserts proof is string {
  const invalid=()=>new Error('The timestamp proof must be canonical base64 and no larger than 64 KiB.');
  if(typeof proof!=='string'||!proof.length||proof.length>87384||proof.length%4!==0||!/^[A-Za-z0-9+/]+={0,2}$/.test(proof))throw invalid();
  let decoded:string;try{decoded=atob(proof);}catch{throw invalid();}
  if(decoded.length>65536||btoa(decoded)!==proof)throw invalid();
}
function validString(v: unknown, name: string, max: number, allowEmpty = false): asserts v is string { if (typeof v !== 'string' || v.length > max || (!allowEmpty && !v.trim())) throw new Error(`${name} is missing or too long.`); }
export function validateSource(s: Source) {
  if (!s || !['csv','noaa','practice'].includes(s.kind) || s.unit !== 'm') throw new Error('The source must describe water levels in metres.');
  validString(s.name, 'Source name', 160); validString(s.datum, 'Vertical datum', 80);
  for (const [k, v] of Object.entries(s)) { if (!['kind','name','datum','unit','url','station','date','retrievedAt','note'].includes(k)) throw new Error('Unrecognised source field.'); validString(v, 'Source field', k === 'note' ? 1500 : 1000); }
  if (s.url) { let u: URL; try { u = new URL(s.url); } catch { throw new Error('Source link must be a valid HTTPS URL.'); } if (u.protocol !== 'https:' || u.username || u.password) throw new Error('Source link must use HTTPS without credentials.'); }
}
export function validateDecisions(decisions: Decision[], audit: Audit, complete = true): Decision[] {
  if (!Array.isArray(decisions) || decisions.length > audit.rows.length) throw new Error('The review decisions are invalid.');
  const flagged = new Set(audit.rows.filter(r => r.flags.length).map(r => r.rowId)), seen = new Set<string>();
  for (const d of decisions) {
    if (!d || Object.keys(d).sort().join(',') !== 'action,reason,rowId' || !flagged.has(d.rowId) || seen.has(d.rowId) || !['keep','exclude'].includes(d.action)) throw new Error('A decision does not match a unique flagged reading.');
    validString(d.reason, 'Decision reason', 600); if (d.reason.trim().length < 3) throw new Error('Add a reason of at least three characters.'); seen.add(d.rowId);
  }
  if (complete && flagged.size !== seen.size) throw new Error(`Review all ${flagged.size - seen.size} remaining flagged readings before sealing.`);
  return [...decisions].sort((a,b) => Number(a.rowId.slice(1)) - Number(b.rowId.slice(1)));
}
export function restoreDraft(input: string | Draft): Draft {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  if (new TextEncoder().encode(text).length > MAX_BUNDLE_BYTES) throw new Error('Draft backup is too large. Use a JSON file under 5 MiB.');
  let d: Draft; try { d = JSON.parse(text); } catch { throw new Error('This is not valid draft JSON.'); }
  if (!d || Object.keys(d).sort().join(',') !== 'config,decisions,id,name,rawCSV,source,updatedAt') throw new Error('This is not a supported Tideprint draft backup.');
  validString(d.id, 'Draft ID', 100); validString(d.name, 'Review name', 120, true); validString(d.updatedAt, 'Draft date', 40);
  if (!Number.isFinite(Date.parse(d.updatedAt)) || typeof d.rawCSV !== 'string') throw new Error('The draft data or date is invalid.');
  validateSource(d.source); validateConfig(d.config);
  const audit = analyze(parseCSV(d.rawCSV), d.config);
  return {...d, decisions: validateDecisions(d.decisions, audit, false)};
}
export async function seal(draft: Draft, reviewer: string): Promise<Bundle> {
  validString(draft.name, 'Review name', 120); validString(reviewer, 'Reviewer name', 100); validateSource(draft.source);
  const audit = analyze(parseCSV(draft.rawCSV), draft.config), decisions = validateDecisions(draft.decisions, audit);
  const manifest: Manifest = { schema: 'tideprint/receipt/1', name: draft.name.trim(), createdAt: new Date().toISOString(), reviewer: reviewer.trim(), source: draft.source, rawHash: await sha256(draft.rawCSV), config: draft.config, audit, decisions };
  return { schema: 'tideprint/bundle/1', manifest, digest: await sha256(canonical(manifest)), rawCSV: draft.rawCSV };
}
export async function verifyBundle(input: string | Bundle): Promise<Bundle> {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  if (new TextEncoder().encode(text).length > MAX_BUNDLE_BYTES) throw new Error('Receipt is too large. Use a JSON file under 5 MiB.');
  let b: Bundle; try { b = JSON.parse(text); } catch { throw new Error('This is not valid JSON. Choose a Tideprint receipt file.'); }
  if (!b || b.schema !== 'tideprint/bundle/1' || typeof b.rawCSV !== 'string' || !/^[a-f0-9]{64}$/.test(b.digest) || !b.manifest || b.manifest.schema !== 'tideprint/receipt/1') throw new Error('This is not a supported Tideprint receipt.');
  if (Object.keys(b).some(k => !['schema','manifest','digest','rawCSV','proof'].includes(k))) throw new Error('Unrecognised receipt field.');
  const m = b.manifest;
  if (Object.keys(m).sort().join(',') !== 'audit,config,createdAt,decisions,name,rawHash,reviewer,schema,source') throw new Error('The receipt manifest has unexpected fields.');
  validString(m.name, 'Review name', 120); validString(m.reviewer, 'Reviewer name', 100);
  if (typeof m.createdAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(m.createdAt) || !Number.isFinite(Date.parse(m.createdAt))) throw new Error('The receipt date is invalid.');
  validateSource(m.source); validateConfig(m.config);
  if (await sha256(b.rawCSV) !== m.rawHash) throw new Error('Original data does not match. The CSV bytes have changed.');
  if (await sha256(canonical(m)) !== b.digest) throw new Error('The review record does not match its seal. A field has changed.');
  const audit = analyze(parseCSV(b.rawCSV), m.config);
  if (canonical(audit) !== canonical(m.audit)) throw new Error('The data checks cannot be reproduced with this algorithm version.');
  if (canonical(validateDecisions(m.decisions, audit)) !== canonical(m.decisions)) throw new Error('Decision order is invalid.');
  if (b.proof !== undefined) validateProofEncoding(b.proof);
  return b;
}
export function reviewedCSV(bundle: Bundle): string {
  const rows = parseCSV(bundle.rawCSV), ds = new Map(bundle.manifest.decisions.map(d => [d.rowId,d]));
  return ['timestamp,value,review,reason', ...rows.map(r => [r.time, r.value === null ? '' : r.value, ds.get(r.id)?.action ?? 'not flagged', ds.get(r.id)?.reason ?? ''].map(csvCell).join(','))].join('\r\n');
}
