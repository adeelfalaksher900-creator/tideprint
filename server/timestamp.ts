import { randomBytes } from 'node:crypto';
import { checkDigest, encodeDetached, parseTimestamp, sha, visit, type Entry, type StampNode } from './ots.ts';
import { fetchBounded, RequestError } from './http.ts';
const CALENDARS=['https://a.pool.opentimestamps.org','https://b.pool.opentimestamps.org'];
const ALLOWED=new Set(['a.pool.opentimestamps.org','b.pool.opentimestamps.org','alice.btc.calendar.opentimestamps.org','bob.btc.calendar.opentimestamps.org','finney.calendar.eternitywall.com','a.pool.eternitywall.com','ots.btc.catallaxy.com']);
const ACCEPT={'Accept':'application/vnd.opentimestamps.v1'};
export function validDigest(v:unknown):asserts v is string{if(typeof v!=='string'||!/^[a-f0-9]{64}$/.test(v))throw new RequestError('Use a 64-character SHA-256 receipt digest.');}
export function decodeProof(v:unknown):Buffer{if(typeof v!=='string'||v.length>90000||!/^[A-Za-z0-9+/]+={0,2}$/.test(v))throw new RequestError('Use a standard base64 timestamp proof under 64 KiB.');const b=Buffer.from(v,'base64');if(b.toString('base64')!==v||b.length>65536)throw new RequestError('Timestamp proof encoding is invalid.');return b;}
export async function stamp(digest:unknown){
 validDigest(digest);
 const msg=Buffer.from(digest,'hex'),nonce=randomBytes(16),salted=Buffer.concat([msg,nonce]),commit=sha(salted);
 const results=await Promise.allSettled(CALENDARS.map(async url=>parseTimestamp(await fetchBounded(url+'/digest',{method:'POST',headers:{...ACCEPT,'Content-Type':'application/x-www-form-urlencoded'},body:new Uint8Array(commit)},12000),commit)));
 const nodes=results.filter((r):r is PromiseFulfilledResult<StampNode>=>r.status==='fulfilled').map(r=>r.value);
 if(!nodes.length)throw new Error('Timestamp calendars are unavailable. Your sealed receipt is safe. Please try again later.');
 const child:StampNode={msg:commit,entries:nodes.flatMap(n=>n.entries)},root:StampNode={msg,entries:[{kind:'op',tag:0xf0,arg:nonce,child:{msg:salted,entries:[{kind:'op',tag:8,child}]}}]};
 return {proof:encodeDetached(digest,root).toString('base64'),status:'pending',calendars:nodes.length,message:'Calendar promises received. Bitcoin confirmation is not available yet. Keep this proof and check again later.'};
}
export async function bitcoinHeader(height:number,msg:Buffer){
 if(msg.length!==32)throw new Error('The Bitcoin attestation has an invalid Merkle root.');
 const base='https://blockstream.info/api';
 const hash=(await fetchBounded(base+'/block-height/'+height,{},100)).toString().trim();
 if(!/^[a-f0-9]{64}$/.test(hash))throw new Error('The Bitcoin explorer returned an invalid block hash.');
 const hex=(await fetchBounded(base+'/block/'+hash+'/header',{},200)).toString().trim();
 if(!/^[a-f0-9]{160}$/.test(hex))throw new Error('The Bitcoin explorer returned an invalid block header.');
 const header=Buffer.from(hex,'hex'),actual=Buffer.from(sha(sha(header))).reverse().toString('hex');
 if(actual!==hash||!header.subarray(36,68).equals(msg))throw new Error('Timestamp path does not match the Bitcoin block header.');
 // Check header proof of work. Full chain selection still relies on the named explorer.
 const bits=header.readUInt32LE(72),exponent=bits>>>24,coefficient=bits&0x7fffff;
 if((bits&0x800000)||!coefficient||exponent<3||exponent>32)throw new Error('Invalid Bitcoin difficulty target.');
 const target=BigInt(coefficient)<<(8n*BigInt(exponent-3));
 if(BigInt('0x'+hash)>target)throw new Error('Bitcoin header proof of work does not meet its target.');
 const tip=Number((await fetchBounded(base+'/blocks/tip/height',{},30)).toString().trim());
 if(!Number.isSafeInteger(tip)||tip<height)throw new Error('Bitcoin explorer height could not be checked.');
 return {height,blockHash:hash,time:new Date(header.readUInt32LE(68)*1000).toISOString(),confirmations:tip-height+1,explorer:'Blockstream',url:'https://blockstream.info/block/'+hash};
}
export async function inspectProof(digest:unknown,proofValue:unknown,upgrade:unknown=false){
 validDigest(digest);if(typeof upgrade!=='boolean')throw new RequestError('Upgrade must be true or false.');
 const proof=decodeProof(proofValue);let root:StampNode;try{root=checkDigest(digest,proof);}catch(e){throw new RequestError(e instanceof Error?e.message:'Invalid timestamp proof.');}
 const pending:{node:StampNode;uri:string}[]=[];visit(root,(node,e)=>{if(e.kind==='pending'&&pending.length<4&&!pending.some(p=>p.uri===e.uri&&p.node.msg.equals(node.msg)))pending.push({node,uri:e.uri});});
 let updated=0;
 if(upgrade){const fetched=await Promise.allSettled(pending.map(async p=>{
  const u=new URL(p.uri);if(!ALLOWED.has(u.hostname)||u.port||u.pathname!=='/')throw new Error('This calendar is outside Tideprint’s fixed allowlist. Export the .ots file for another verifier.');
  return {parent:p.node,child:parseTimestamp(await fetchBounded(u.origin+'/timestamp/'+p.node.msg.toString('hex'),{headers:ACCEPT},65536),p.node.msg)};
 }));for(const x of fetched)if(x.status==='fulfilled'){const {parent,child}=x.value;updated+=mergeNodes(parent,child);}}
 const attestations:{node:StampNode;height:number}[]=[];visit(root,(node,e)=>{if(e.kind==='bitcoin'&&attestations.length<4)attestations.push({node,height:e.height});});
 let confirmation:Awaited<ReturnType<typeof bitcoinHeader>>|undefined;let checkError='';
 for(const a of attestations){try{confirmation=await bitcoinHeader(a.height,a.node.msg);break;}catch(e){checkError=e instanceof Error?e.message:'Could not reach the Bitcoin explorer.';}}
 const encoded=encodeDetached(digest,root).toString('base64');
 if(confirmation)return {proof:encoded,status:'confirmed',confirmation,updated,message:'Hash path, Merkle root and header proof of work match. Chain height and selection rely on Blockstream; this is not a full-node consensus check.'};
 if(attestations.length)return {proof:encoded,status:'unverified',updated,message:checkError||'A Bitcoin attestation exists but could not be verified. Please try again later.'};
 return {proof:encoded,status:'pending',updated,message:upgrade?'No verified Bitcoin attestation is available yet. Calendars may need several hours. Your existing proof has been kept.':'This proof contains calendar promises. Check again later for a Bitcoin attestation.'};
}
function entryKey(e:Entry):string {return e.kind==='bitcoin'?'b'+e.height:e.kind==='pending'?'p'+e.uri:'o'+e.tag+':'+(e.arg?.toString('hex')??'');}
export function mergeNodes(parent:StampNode,child:StampNode):number{if(!parent.msg.equals(child.msg))throw new Error('Cannot merge different timestamp commitments.');let count=0;for(const entry of child.entries){const existing=parent.entries.find(e=>entryKey(e)===entryKey(entry));if(!existing){parent.entries.push(entry);count++;}else if(existing.kind==='op'&&entry.kind==='op')count+=mergeNodes(existing.child,entry.child);}return count;}
