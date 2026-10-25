import {useRef,useState} from 'react';

// A completed earlier task must not clear a newer task's progress indicator.
export function useTaskStatus(){
 const [busy,setBusy]=useState('');
 const sequence=useRef(0);
 const startTask=(message:string)=>{
  const id=++sequence.current;
  setBusy(message);
  return ()=>{if(sequence.current===id)setBusy('');};
 };
 return {busy,startTask};
}
