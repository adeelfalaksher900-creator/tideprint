// Reproducible fault-injection checks, not a sensor-error accuracy benchmark.
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {getNOAA} from '../server/noaa.ts';
import {parseCSV} from '../src/core/csv.ts';
import {analyze} from '../src/core/audit.ts';
import {sha256} from '../src/core/receipt.ts';
import {DEFAULT_CONFIG} from '../src/core/types.ts';
const dir='examples/evaluation';mkdirSync(dir,{recursive:true});
const stations=['9414290','8518750','9447130'];
const date='2024-10-01';
type Pair=[string,string];
const findings=[];
for(const station of stations){
 const file=`${dir}/${station}-${date}.json`;
 const sample=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):await getNOAA(station,date);
 if(!existsSync(file))writeFileSync(file,JSON.stringify(sample,null,2)+'\n');
 const rows=parseCSV(sample.rawCSV),base=rows.map(r=>[r.time,r.value===null?'':String(r.value)] as Pair);
 if(base.length<150)throw new Error('Evaluation requires a complete station day.');
 const cases:{name:string;row:number;flag:string;edit:(r:Pair[])=>void}[]=[
  {name:'blank value',row:31,flag:'missing',edit:r=>{r[30][1]='';}},
  {name:'out-of-range isolated spike',row:61,flag:'spike',edit:r=>{r[60][1]='100';}},
  {name:'30-minute constant stretch',row:107,flag:'flat',edit:r=>{for(let i=100;i<=106;i++)r[i][1]='1.100';}},
  {name:'repeated timestamp',row:41,flag:'duplicate',edit:r=>{r[40][0]=r[39][0];}},
  {name:'four removed observations',row:81,flag:'gap',edit:r=>{r.splice(80,4);}},
  {name:'two reversed rows',row:62,flag:'order',edit:r=>{[r[60],r[61]]=[r[61],r[60]];}},
  {name:'fast positive change',row:111,flag:'rate',edit:r=>{r[110][1]=String(Number(r[109][1])+.5);}}
 ];
 const baseline=analyze(rows,DEFAULT_CONFIG);
 const results=cases.map(c=>{const edited=structuredClone(base);c.edit(edited);const raw='timestamp,value\n'+edited.map(r=>r.join(',')).join('\n')+'\n';const audit=analyze(parseCSV(raw),DEFAULT_CONFIG);const flagged=audit.rows.find(r=>r.rowId===`r${c.row}`)!.flags.map(f=>f.code);return {case:c.name,expectedRow:c.row,expectedFlag:c.flag,observedFlags:flagged,passed:flagged.includes(c.flag as never)};});
 findings.push({station,source:sample.source,rawSHA256:await sha256(sample.rawCSV),observations:rows.length,baselineFlagged:baseline.summary.flagged,baselineMeaning:'Flags on unmodified archived data; these are not labelled false positives.',results});
}
const results=findings.flatMap(s=>s.results),passed=results.filter(r=>r.passed).length;
const report={kind:'Tideprint deterministic fault-injection evaluation',date,config:DEFAULT_CONFIG,algorithm:'tideprint-qa/1.0.0',passed,total:results.length,caseDetectionRate:passed/results.length,limitations:['Deliberately selected synthetic faults in real NOAA series.','No independent labels, random holdout, analyst user study or field-impact measurement.','The detection rate is not sensor-error accuracy, ML precision/recall or a judging score.'],stations:findings};
writeFileSync(`${dir}/results.json`,JSON.stringify(report,null,2)+'\n');
console.log(`${passed}/${results.length} expected injected fault cases detected across ${findings.length} archived NOAA station-days.`);
if(passed!==results.length)process.exitCode=1;
