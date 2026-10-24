export type Measurement={session:string;task:string;baselineMinutes:number;toolMinutes:number;outcome:'completed'|'partial'|'failed';notes:string};
export function measurementRecord(input:Measurement,digests:[string,string]){
 if(!input||!input.session.trim()||input.session.length>80||!input.task.trim()||input.task.length>200||!['completed','partial','failed'].includes(input.outcome)||input.notes.length>2000)throw new Error('Complete the session, task and outcome fields within their limits.');
 if(!Number.isFinite(input.baselineMinutes)||!Number.isFinite(input.toolMinutes)||input.baselineMinutes<=0||input.baselineMinutes>1440||input.toolMinutes<=0||input.toolMinutes>1440)throw new Error('Enter observed task times greater than zero and up to 1,440 minutes.');
 if(digests.some(d=>!/^[a-f0-9]{64}$/.test(d)))throw new Error('A measurement must refer to both compared receipt digests.');
 return {schema:'tideprint/measurement/1',...input,session:input.session.trim(),task:input.task.trim(),receiptDigests:digests,differenceMinutes:Math.round((input.baselineMinutes-input.toolMinutes)*1000)/1000,evidence:'Self-reported task measurement. Not an independently audited field outcome or climate-impact claim. Record the same task and data for both timings; retain the protocol and original observations.'};
}
