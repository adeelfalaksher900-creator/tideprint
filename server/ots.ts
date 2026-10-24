import { createHash } from 'node:crypto';
// Original, bounded implementation of the public OpenTimestamps v1 wire format.
// Supported operations: SHA-256, append, prepend, reverse. Unknown operations fail closed.
const MAGIC = Buffer.from('004f70656e54696d657374616d7073000050726f6f6600bf89e2e884e89294','hex');
const PENDING = '83dfe30d2ef90c8e', BITCOIN = '0588960d73d71901';
export type Entry = { kind:'pending'; uri:string } | { kind:'bitcoin'; height:number } | { kind:'op'; tag:number; arg?:Buffer; child:StampNode };
export type StampNode = { msg:Buffer; entries:Entry[] };
export const sha = (b:Uint8Array) => createHash('sha256').update(b).digest();
const vi = (n:number):Buffer => { if(!Number.isSafeInteger(n)||n<0)throw new Error('Invalid proof integer.');const a=[];do{let b=n%128;n=Math.floor(n/128);if(n)b|=128;a.push(b);}while(n);return Buffer.from(a); };
const vb = (b:Buffer) => Buffer.concat([vi(b.length),b]);
class Reader {
  data:Buffer; offset=0; count=0;
  constructor(data:Buffer){this.data=data;if(data.length>65536)throw new Error('Timestamp proof exceeds 64 KiB.');}
  bytes(n:number){if(n<0||this.offset+n>this.data.length)throw new Error('Truncated timestamp proof.');const b=this.data.subarray(this.offset,this.offset+n);this.offset+=n;return b;}
  byte(){return this.bytes(1)[0];}
  integer(max=10000000){let n=0,m=1;for(let i=0;i<5;i++){const b=this.byte();n+=(b&127)*m;if(n>max)throw new Error('Proof integer is too large.');if(!(b&128)){if(i&&b===0)throw new Error('Non-canonical proof integer.');return n;}m*=128;}throw new Error('Invalid proof integer.');}
  variable(max:number){return this.bytes(this.integer(max));}
  eof(){if(this.offset!==this.data.length)throw new Error('Unexpected trailing bytes in timestamp proof.');}
}
function uriValid(uri:string){if(uri.length>1000||!/^https:\/\/[A-Za-z0-9._/-]+$/.test(uri))throw new Error('Pending timestamp URL must be a plain HTTPS address.');const u=new URL(uri);if(u.username||u.password||u.search||u.hash)throw new Error('Invalid pending timestamp URL.');}
export function pendingNode(msg:Buffer,uri:string):StampNode { uriValid(uri);return {msg,entries:[{kind:'pending',uri}]}; }
function apply(tag:number,msg:Buffer,arg?:Buffer){let result:Buffer;if(tag===8)result=sha(msg);else if(tag===0xf0)result=Buffer.concat([msg,arg!]);else if(tag===0xf1)result=Buffer.concat([arg!,msg]);else if(tag===0xf2)result=Buffer.from(msg).reverse();else throw new Error(`Unsupported timestamp operation 0x${tag.toString(16)}.`);if(result.length>4096)throw new Error('Timestamp operation result exceeds 4096 bytes.');return result;}
function readNode(r:Reader,msg:Buffer,depth=0):StampNode {
  if(depth>128||++r.count>20000)throw new Error('Timestamp proof is too complex.');
  const entries:Entry[]=[];
  const entry=(tag:number)=>{
    if(++r.count>20000)throw new Error('Timestamp proof is too complex.');
    if(tag===0){const kind=r.bytes(8).toString('hex'),payload=new Reader(r.variable(8192));if(kind===PENDING){const uri=payload.variable(1000).toString('utf8');uriValid(uri);payload.eof();entries.push({kind:'pending',uri});}else if(kind===BITCOIN){const height=payload.integer();payload.eof();entries.push({kind:'bitcoin',height});}else throw new Error('This timestamp uses an unsupported attestation.');}
    else {let arg:Buffer|undefined;if(tag===0xf0||tag===0xf1){arg=r.variable(4096);if(!arg.length)throw new Error('Empty timestamp argument.');}const child=readNode(r,apply(tag,msg,arg),depth+1);entries.push({kind:'op',tag,...(arg?{arg}:{}),child});}
  };
  let tag=r.byte();while(tag===0xff){entry(r.byte());tag=r.byte();}entry(tag);
  return {msg,entries};
}
function encodeNode(n:StampNode,depth=0):Buffer {
  if(depth>128||!n.entries.length)throw new Error('Invalid timestamp node.');
  return Buffer.concat(n.entries.map((e,i)=>{
    let b:Buffer;
    if(e.kind==='pending'){uriValid(e.uri);b=Buffer.concat([Buffer.from([0]),Buffer.from(PENDING,'hex'),vb(vb(Buffer.from(e.uri)))]);}
    else if(e.kind==='bitcoin')b=Buffer.concat([Buffer.from([0]),Buffer.from(BITCOIN,'hex'),vb(vi(e.height))]);
    else b=Buffer.concat([Buffer.from([e.tag]),...(e.arg?[vb(e.arg)]:[]),encodeNode(e.child,depth+1)]);
    return i<n.entries.length-1?Buffer.concat([Buffer.from([255]),b]):b;
  }));
}
export function parseTimestamp(data:Buffer,msg:Buffer){const r=new Reader(data),node=readNode(r,msg);r.eof();return node;}
export function parseDetached(data:Buffer):{digest:string;node:StampNode}{const r=new Reader(data);if(!r.bytes(MAGIC.length).equals(MAGIC)||r.integer()!==1||r.byte()!==8)throw new Error('Not a supported SHA-256 OpenTimestamps proof.');const msg=r.bytes(32),node=readNode(r,msg);r.eof();return {digest:msg.toString('hex'),node};}
export function encodeDetached(digest:string,node:StampNode):Buffer { if(!/^[a-f0-9]{64}$/.test(digest)||!node.msg.equals(Buffer.from(digest,'hex')))throw new Error('Invalid receipt digest.');const b=Buffer.concat([MAGIC,Buffer.from([1,8]),Buffer.from(digest,'hex'),encodeNode(node)]);if(b.length>65536)throw new Error('Timestamp proof exceeds 64 KiB.');return b; }
export function checkDigest(digest:string,proof:Buffer){if(!/^[a-f0-9]{64}$/.test(digest))throw new Error('Invalid receipt digest.');const p=parseDetached(proof);if(p.digest!==digest)throw new Error('This timestamp proof belongs to a different receipt.');return p.node;}
export function visit(n:StampNode,fn:(node:StampNode,e:Entry)=>void){for(const e of [...n.entries]){fn(n,e);if(e.kind==='op')visit(e.child,fn);}}
