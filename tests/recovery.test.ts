import test from 'node:test';
import assert from 'node:assert/strict';
import {readTextFile} from '../src/core/files.ts';
import {restoreDraft,seal} from '../src/core/receipt.ts';
import {parseCSV} from '../src/core/csv.ts';
import {analyze} from '../src/core/audit.ts';
import {DEFAULT_CONFIG,type Draft} from '../src/core/types.ts';
const raw='timestamp,value\r\n2024-10-01T00:00:00Z,1\r\n2024-10-01T00:06:00Z,12\r\n2024-10-01T00:12:00Z,1\r\n';
function backup():Draft {const config={...DEFAULT_CONFIG,spike:.7};const audit=analyze(parseCSV(raw),config);return {id:'backup-test',name:'Original review',rawCSV:raw,source:{kind:'noaa',name:'Station source',station:'9414290',date:'2024-10-01',datum:'MLLW',unit:'m',url:'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter'},config,decisions:audit.rows.filter(r=>r.flags.length).slice(0,1).map(r=>({rowId:r.rowId,action:'keep',reason:'Checked against original source.'})),updatedAt:'2026-10-24T00:00:00.000Z'};}
test('draft backup restores original bytes, provenance, non-default settings and partial decisions',()=>{const d=backup();assert.deepEqual(restoreDraft(JSON.stringify(d)),d);});
test('draft restore rejects malformed, duplicate and unrelated decisions before a view can use them',()=>{for(const decisions of [[null],[{rowId:'r1',action:'keep',reason:'Not flagged'}],[backup().decisions[0],backup().decisions[0]]]){assert.throws(()=>restoreDraft({...backup(),decisions} as Draft));}});
test('partial backup is restorable but cannot bypass unresolved-review sealing',async()=>{const d=restoreDraft({...backup(),decisions:[]});await assert.rejects(seal(d,'Reviewer'),/Review all/);});
test('file decoding preserves a UTF-8 BOM and CRLF for the original-data hash',async()=>{const original='\uFEFF'+raw;const file=new File([new TextEncoder().encode(original)],'levels.csv');assert.equal(await readTextFile(file,1048576),original);assert.equal(parseCSV(await readTextFile(file,1048576)).length,3);});
test('file reading rejects invalid UTF-8 and excessive bytes',async()=>{await assert.rejects(readTextFile(new File([Uint8Array.of(0xff)],'bad.csv'),1048576));await assert.rejects(readTextFile(new File(['12345'],'large.csv'),4),/under/);});
