import {useEffect,useRef,useState} from 'react';
import {readWorkspaceIndex,writeWorkspace,STORAGE_KEY,type Workspace} from './core/workspace.ts';
export function useWorkspace(){
 const [library,setLibrary]=useState<Workspace>({drafts:[],bundles:[]});
 const [storageReady,setReady]=useState(false),[storageBlocked,setBlocked]=useState(false),[storageError,setError]=useState(''),[recoveryRaw,setRecoveryRaw]=useState('');
 const [saving,setSaving]=useState(true);
 const last=useRef<string|null>(null),blocked=useRef(false),generation=useRef(0);
 useEffect(()=>{
  try{last.current=localStorage.getItem(STORAGE_KEY);if(last.current)setLibrary(readWorkspaceIndex(last.current));}
  catch{blocked.current=true;setBlocked(true);setRecoveryRaw(last.current??'');setError('Saved reviews could not be read. Export your work before leaving this page.');}
  setReady(true);
  const changed=(e:StorageEvent)=>{if((e.key===STORAGE_KEY||e.key===null)&&localStorage.getItem(STORAGE_KEY)!==last.current){blocked.current=true;setBlocked(true);setError('Saved work changed in another tab. Export this workspace before reloading.');}};
  window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);
 },[]);
 useEffect(()=>{
  if(!storageReady)return;
  if(blocked.current){setSaving(false);return;}
  setSaving(true);
  let active=true;const version=++generation.current;
  const save=()=>{if(!active||blocked.current||version!==generation.current)return;const next=JSON.stringify(library);try{writeWorkspace(localStorage,last.current,next);last.current=next;setError('');}catch{if(localStorage.getItem(STORAGE_KEY)!==last.current){blocked.current=true;setBlocked(true);setError('Saved work changed in another tab. Export this workspace before reloading.');}else setError('This device could not save more data. Your current work is still open. Export it before closing this page.');}finally{setSaving(false);}};
  // Web Locks serialize the compare-and-write across tabs on supported browsers.
  if(navigator.locks)void navigator.locks.request('tideprint.saved-work',save).catch(()=>{if(active){setSaving(false);setError('Saved work could not be coordinated. Export this workspace before reloading.');}});
  else save();
  return()=>{active=false;};
 },[library,storageReady]);
 return {library,setLibrary,storageBlocked,storageError,recoveryRaw,saving};
}
