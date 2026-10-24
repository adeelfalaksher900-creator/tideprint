import { analyze } from './core/audit.ts';
import { parseCSV } from './core/csv.ts';
self.onmessage = e => { try { const readings = parseCSV(e.data.rawCSV); self.postMessage({ readings, audit: analyze(readings,e.data.config) }); } catch(e) { self.postMessage({ error:e instanceof Error?e.message:'Could not check this file.' }); } };
