// Bounded local capacity evidence. This is not a browser, field or web-scale study.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {cpus,totalmem} from 'node:os';
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {parseCSV} from '../src/core/csv.ts';
import {analyze} from '../src/core/audit.ts';
import {seal,verifyBundle,canonical,sha256} from '../src/core/receipt.ts';
import {DEFAULT_CONFIG,type Draft} from '../src/core/types.ts';
import {restoreWorkspace,workspaceBackup} from '../src/core/workspace.ts';

if(!isMainThread){
 const start=performance.now();const audit=analyze(parseCSV(workerData.rawCSV),DEFAULT_CONFIG);
 parentPort!.postMessage({ms:performance.now()-start,audit});
}else{
 const summary=(values:number[])=>{const sorted=[...values].sort((a,b)=>a-b);const round=(n:number)=>Math.round(n*100)/100;return {samples:values.length,p50:round(sorted[Math.ceil(.5*sorted.length)-1]),p95:round(sorted[Math.ceil(.95*sorted.length)-1]),max:round(sorted.at(-1)!)};};
 const fixture=JSON.parse(readFileSync('examples/evaluation/9414290-2024-10-01.json','utf8'));
 const maxCSV='timestamp,value\n'+Array.from({length:3000},(_,i)=>`${new Date(Date.UTC(2024,9,1)+i*360000).toISOString()},${(1.4+Math.sin(i/20)*.8+Math.sin(i/47)*.15).toFixed(3)}`).join('\n')+'\n';
 const profiles=[];
 for(const [name,rawCSV,source]of [['Archived NOAA day',fixture.rawCSV,fixture.source],['Synthetic maximum-row file',maxCSV,{kind:'csv',name:'QA capacity series',datum:'MLLW',unit:'m'}]] as const){
  const readings=parseCSV(rawCSV),audit=analyze(readings,DEFAULT_CONFIG),timings={analysis:[] as number[],seal:[] as number[],verify:[] as number[]};
  const draft:Draft={id:'QA-BENCHMARK',name:'Capacity check',rawCSV,source,config:DEFAULT_CONFIG,decisions:audit.rows.filter(r=>r.flags.length).map(r=>({rowId:r.rowId,action:'keep',reason:'Automated capacity check only; not an analyst judgement.'})),updatedAt:'2026-10-25T00:00:00Z'};
  let verified=0;
  for(let i=0;i<23;i++){
   let start=performance.now();analyze(parseCSV(rawCSV),DEFAULT_CONFIG);const analysis=performance.now()-start;
   start=performance.now();const bundle=await seal(draft,'Automated capacity check');const sealing=performance.now()-start;
   start=performance.now();const checked=await verifyBundle(bundle);const verify=performance.now()-start;
   if(checked.digest!==bundle.digest)throw new Error('Receipt mismatch.');
   if(i>=3){timings.analysis.push(analysis);timings.seal.push(sealing);timings.verify.push(verify);verified++;}
  }
  profiles.push({name,rows:readings.length,bytes:Buffer.byteLength(rawCSV),rawSHA256:await sha256(rawCSV),flagged:audit.summary.flagged,verifiedReceipts:verified,milliseconds:{analysis:summary(timings.analysis),seal:summary(timings.seal),verify:summary(timings.verify)}});
 }
 const expected=canonical(analyze(parseCSV(maxCSV),DEFAULT_CONFIG)),start=performance.now();
 const concurrent=await Promise.all(Array.from({length:5},()=>new Promise<{ms:number;audit:unknown}>((resolve,reject)=>{const w=new Worker(new URL(import.meta.url),{workerData:{rawCSV:maxCSV}});w.once('message',resolve);w.once('error',reject);w.once('exit',code=>{if(code)reject(new Error(`Worker exited ${code}`));});})));
 const concurrentWall=performance.now()-start;
 if(concurrent.some(r=>canonical(r.audit)!==expected))throw new Error('Concurrent analysis diverged.');
 const drafts:Draft[]=Array.from({length:30},(_,i)=>({id:`QA-${i}`,name:`Capacity draft ${i}`,rawCSV:maxCSV,source:{kind:'csv',name:'QA capacity series',datum:'MLLW',unit:'m'},config:DEFAULT_CONFIG,decisions:[],updatedAt:'2026-10-25T00:00:00Z'}));
 const backup=workspaceBackup({drafts,bundles:[]});const restoreStart=performance.now();const restored=await restoreWorkspace(backup,{drafts:[],bundles:[]});const restoreMs=performance.now()-restoreStart;
 if(restored.drafts.length!==30)throw new Error('Restore incomplete.');
 const result={schema:'tideprint/capacity-check/1',recordedAt:new Date().toISOString(),environment:{node:process.version,platform:process.platform,arch:process.arch,cpu:cpus()[0]?.model,logicalCPUs:cpus().length,memoryGiB:Math.round(totalmem()/2**30)},method:'3 warmups, then 20 measured operations per profile; p95 uses nearest-rank; milliseconds include local computation only.',profiles,concurrent:{workers:5,rowsEach:3000,allAuditsMatch:true,wallMilliseconds:Math.round(concurrentWall*100)/100,workerAnalysisMilliseconds:summary(concurrent.map(r=>r.ms)),includesWorkerStartupInWallTime:true},workspaceRestore:{items:30,rowsEach:3000,bytes:Buffer.byteLength(backup),milliseconds:Math.round(restoreMs*100)/100,allRestored:true},limits:['Synthetic maximum-row data are not field observations.','Node execution is not a browser-device latency guarantee.','Five local workers do not demonstrate organizational adoption or production web throughput.','No analyst task times, measured climate benefits or uptime SLA are inferred.']};
 mkdirSync('examples/operations',{recursive:true});writeFileSync('examples/operations/capacity.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}
