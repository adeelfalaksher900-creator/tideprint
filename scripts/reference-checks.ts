// Cross-implementation checks against IOOS's Python library, not analyst testing.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseCSV} from '../src/core/csv.ts';
import {analyze} from '../src/core/audit.ts';
import {DEFAULT_CONFIG} from '../src/core/types.ts';
const originals=['9414290','8518750','9447130'].map(station=>({name:`NOAA ${station} 2024-10-01`,rawCSV:JSON.parse(readFileSync(`examples/evaluation/${station}-2024-10-01.json`,'utf8')).rawCSV}));
const values=[-6,-5,-4.999,0,8,8.001,9,null,0,0.3,0.6,1,0,-1,0,null,1,1,1];
originals.push({name:'Synthetic range, missing and rate boundary cases',rawCSV:'timestamp,value\n'+values.map((value,i)=>`${new Date(Date.UTC(2024,9,1)+i*360000).toISOString()},${value??''}`).join('\n')+'\n'});
const input=originals.map(({name,rawCSV})=>{const readings=parseCSV(rawCSV),audit=analyze(readings,DEFAULT_CONFIG);return {name,config:DEFAULT_CONFIG,values:readings.map(r=>r.value),seconds:readings.map(r=>r.ms/1000),flags:audit.rows.map(r=>r.flags.map(f=>f.code))};});
const result=JSON.parse(execFileSync('python',['scripts/reference-checks.py'],{input:JSON.stringify(input),encoding:'utf8',maxBuffer:1024*1024}));
mkdirSync('examples/evaluation',{recursive:true});writeFileSync('examples/evaluation/reference-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
if(result.mismatches)process.exitCode=1;
