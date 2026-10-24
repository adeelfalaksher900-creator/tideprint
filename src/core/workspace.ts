import {restoreDraft,verifyBundle} from './receipt.ts';
import type {Draft,Bundle} from './types.ts';
export type Workspace={drafts:Draft[];bundles:Bundle[]};
export const STORAGE_KEY='tideprint.library.v1';
export const MAX_WORKSPACE_BYTES=32*1024*1024;
// Validate just the displayed index here. Full records are verified on opening.
export function readWorkspaceIndex(raw:string):Workspace {
 const x=JSON.parse(raw);
 if(!x||!Array.isArray(x.drafts)||!Array.isArray(x.bundles)||x.drafts.length+x.bundles.length>30||x.drafts.some((d:any)=>!d||typeof d.id!=='string'||typeof d.name!=='string'||!d.source||typeof d.source.name!=='string')||x.bundles.some((b:any)=>!b||typeof b.digest!=='string'||!b.manifest||typeof b.manifest.name!=='string'||!b.manifest.source||typeof b.manifest.source.name!=='string'))throw new Error('Saved reviews could not be read.');
 return {drafts:x.drafts,bundles:x.bundles};
}
export function workspaceBackup(workspace:Workspace):string {
 return JSON.stringify({schema:'tideprint/workspace/1',...workspace},null,2);
}
export async function restoreWorkspace(raw:string,current:Workspace,onProgress?:(done:number,total:number)=>void):Promise<Workspace> {
 if(new TextEncoder().encode(raw).length>MAX_WORKSPACE_BYTES)throw new Error('Choose a workspace backup under 32 MiB.');
 let x;try{x=JSON.parse(raw);}catch{throw new Error('This is not valid workspace JSON.');}
 if(!x||x.schema!=='tideprint/workspace/1'||Object.keys(x).sort().join(',')!=='bundles,drafts,schema')throw new Error('Choose a Tideprint workspace backup.');
 const incoming=readWorkspaceIndex(raw),drafts:Draft[]=[],bundles:Bundle[]=[];
 const ids=new Set<string>(),digests=new Set<string>();let done=0;const total=incoming.drafts.length+incoming.bundles.length;
 for(const d of incoming.drafts){if(ids.has(d.id))throw new Error('Backup contains duplicate draft IDs.');ids.add(d.id);drafts.push({...restoreDraft(d),id:crypto.randomUUID()});onProgress?.(++done,total);await new Promise(r=>setTimeout(r,0));}
 for(const b of incoming.bundles){if(digests.has(b.digest))throw new Error('Backup contains duplicate receipts.');digests.add(b.digest);bundles.push(await verifyBundle(b));onProgress?.(++done,total);await new Promise(r=>setTimeout(r,0));}
 const added=bundles.filter(b=>!current.bundles.some(old=>old.digest===b.digest));
 if(current.drafts.length+current.bundles.length+drafts.length+added.length>30)throw new Error('Restoring would exceed 30 items. Export and remove some saved items first.');
 // No mutation occurs until every incoming record has passed validation.
 return {drafts:[...drafts,...current.drafts],bundles:[...added,...current.bundles]};
}
export function writeWorkspace(storage:Pick<Storage,'getItem'|'setItem'>,expected:string|null,next:string):void {
 if(storage.getItem(STORAGE_KEY)!==expected)throw new Error('Saved work changed in another tab. Export this workspace before reloading.');
 storage.setItem(STORAGE_KEY,next);
}
