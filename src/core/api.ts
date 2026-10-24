export async function api<T>(url:string,body?:unknown):Promise<T>{
 let response:Response;
 try{response=await fetch(url,{...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});}
 catch(e){if(e instanceof Error&&['TimeoutError','AbortError'].includes(e.name))throw new Error('The service took too long. Your work is safe; please try again.');throw new Error('The service could not be reached. Check your connection and try again. Your work stays on this device.');}
 if(response.status===429)throw new Error('Too many requests. Wait one minute, then try again. Your review is safe.');
 let data;try{data=await response.json();}catch{throw new Error('The service returned an unreadable response. Please try again.');}
 if(!response.ok)throw new Error(typeof data?.error==='string'?data.error:'The service is unavailable. Please try again.');
 return data;
}
