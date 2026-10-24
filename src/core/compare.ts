import {verifyBundle,canonical} from './receipt.ts';
import {parseCSV} from './csv.ts';
import type {Bundle} from './types.ts';
export async function compareReviews(first:string|Bundle,second:string|Bundle){
 const [a,b]=await Promise.all([verifyBundle(first),verifyBundle(second)]);
 if(a.digest===b.digest)throw new Error('Choose two different review receipts. A receipt cannot provide a second review of itself.');
 if(a.manifest.rawHash!==b.manifest.rawHash)throw new Error('The original CSV files differ. Compare reviews of the same original data.');
 if(canonical(a.manifest.config)!==canonical(b.manifest.config))throw new Error('The check settings differ. Use matching settings before comparing decisions.');
 if(canonical(a.manifest.source)!==canonical(b.manifest.source))throw new Error('The source declarations differ. Confirm a shared source before comparing decisions.');
 const rows=parseCSV(a.rawCSV),right=new Map(b.manifest.decisions.map(d=>[d.rowId,d]));
 const decisions=a.manifest.decisions.map(left=>{const r=rows.find(r=>r.id===left.rowId)!,other=right.get(left.rowId)!;return {rowId:left.rowId,time:r.time,value:r.value,first:{action:left.action,reason:left.reason},second:{action:other.action,reason:other.reason},agrees:left.action===other.action};});
 const agreed=decisions.filter(d=>d.agrees).length;
 return {schema:'tideprint/comparison/1',rawHash:a.manifest.rawHash,source:a.manifest.source,config:a.manifest.config,first:{digest:a.digest,reviewer:a.manifest.reviewer,name:a.manifest.name},second:{digest:b.digest,reviewer:b.manifest.reviewer,name:b.manifest.name},sameReviewerLabel:a.manifest.reviewer.trim().toLowerCase()===b.manifest.reviewer.trim().toLowerCase(),flagged:decisions.length,agreed,disagreed:decisions.length-agreed,agreement:decisions.length?agreed/decisions.length:null,decisions,limits:'Agreement compares keep/exclude actions only. Labels are self-declared; independence, reviewer identity and data accuracy are not established. Share both original receipt files to reproduce this report.'};
}
