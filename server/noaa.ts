import { fetchBounded, RequestError } from './http.ts';
export const STATIONS:Record<string,string>={'9414290':'San Francisco, CA','8518750':'The Battery, NY','9447130':'Seattle, WA'};
export async function getNOAA(station:unknown,date:unknown){
 if(typeof station!=='string'||!Object.hasOwn(STATIONS,station))throw new RequestError('Choose a supported NOAA station.');
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<'2010-01-01'||date>new Date().toISOString().slice(0,10))throw new RequestError('Choose a valid date from 2010 through today.');
 const params=new URLSearchParams({product:'water_level',begin_date:date.replaceAll('-',''),range:'24',datum:'MLLW',station,time_zone:'gmt',units:'metric',format:'json',application:'Tideprint'});
 const url='https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?'+params;
 const data=JSON.parse((await fetchBounded(url,{},400000)).toString('utf8'));
 if(data.error)throw new Error('NOAA: '+String(data.error.message).slice(0,300));
 if(!Array.isArray(data.data)||!data.data.length||data.data.length>300)throw new Error('NOAA returned no usable readings for this day. Try an earlier date.');
 if(String(data.metadata?.id)!==station)throw new Error('NOAA returned a different station.');
 const rawCSV='timestamp,value\n'+data.data.map((d:{t:unknown;v:unknown})=>{if(typeof d.t!=='string'||!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(d.t)||typeof d.v!=='string'||(d.v!==''&&!/^-?\d+(\.\d+)?$/.test(d.v)))throw new Error('NOAA returned an unexpected observation format.');return d.t.replace(' ','T')+':00Z,'+d.v;}).join('\n')+'\n';
 return {rawCSV,source:{kind:'noaa',name:STATIONS[station],station,date,unit:'m',datum:'MLLW',url,retrievedAt:new Date().toISOString(),note:'NOAA CO-OPS six-minute water-level observations. MLLW is the local Mean Lower Low Water datum. NOAA quality status is separate from Tideprint review flags.'}};
}
