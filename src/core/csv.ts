import { MAX_CSV_BYTES, MAX_ROWS, type Reading } from './types.ts';

export function parseCSV(raw: string): Reading[] {
  if (new TextEncoder().encode(raw).length > MAX_CSV_BYTES) throw new Error('This file is too large. Choose a CSV under 1 MiB.');
  if (!raw.trim()) throw new Error('The file is empty. Add timestamp and value columns.');
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const records: { cells: string[]; line: number }[] = [];
  let cells: string[] = [], cell = '', quoted = false, closed = false, line = 1, start = 1;
  const pushCell = () => { cells.push(cell); cell = ''; closed = false; };
  const pushRow = () => { pushCell(); if (cells.some(c => c.trim())) records.push({ cells, line: start }); cells = []; start = line + 1; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } }
      else { cell += c; if (c === '\n') line++; }
      continue;
    }
    if (c === '"') { if (cell || closed) throw new Error(`Line ${line}: a quote must start a field.`); quoted = true; }
    else if (c === ',') pushCell();
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; pushRow(); line++; }
    else { if (closed && !/\s/.test(c)) throw new Error(`Line ${line}: unexpected text after a quoted field.`); if (!closed) cell += c; }
    if (records.length > MAX_ROWS + 1) throw new Error(`Use at most ${MAX_ROWS.toLocaleString()} readings per review.`);
  }
  if (quoted) throw new Error(`Line ${start}: close the quoted field.`);
  if (cell || cells.length || closed) pushRow();
  const header = records.shift()?.cells.map(c => c.trim().toLowerCase());
  if (!header || header.length !== 2 || header[0] !== 'timestamp' || header[1] !== 'value') throw new Error('Use exactly two columns: timestamp,value. Times must be in UTC and values in metres.');
  if (!records.length) throw new Error('Add at least one reading below the header.');
  if (records.length > MAX_ROWS) throw new Error(`Use at most ${MAX_ROWS.toLocaleString()} readings per review.`);
  return records.map(({ cells, line }, i) => {
    if (cells.length !== 2) throw new Error(`Line ${line}: expected two columns, found ${cells.length}.`);
    const t = cells[0].trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|\+00:00)$/.exec(t);
    if (!m) throw new Error(`Line ${line}: use a UTC time such as 2024-10-01T12:00:00Z.`);
    const [y, mo, d, h, min, sec] = m.slice(1, 7).map(Number);
    if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > new Date(Date.UTC(y, mo, 0)).getUTCDate() || h > 23 || min > 59 || (sec || 0) > 59) throw new Error(`Line ${line}: this date or time is not valid.`);
    const ms = Date.parse(t);
    if (!Number.isFinite(ms)) throw new Error(`Line ${line}: this timestamp is not valid.`);
    const s = cells[1].trim();
    if (s && !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) throw new Error(`Line ${line}: value must be a number or an empty field.`);
    const value = s === '' ? null : Number(s);
    if (value !== null && (!Number.isFinite(value) || Math.abs(value) > 1e6)) throw new Error(`Line ${line}: value must be a finite number within ±1,000,000.`);
    return { id: `r${i + 1}`, line, time: new Date(ms).toISOString(), ms, value };
  });
}

export function csvCell(value: unknown): string {
  let s = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
}
