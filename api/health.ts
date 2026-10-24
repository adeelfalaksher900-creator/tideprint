import {endpoint} from '../server/http.ts';
export default endpoint('GET',async()=>({service:'Tideprint',status:'ok',schema:'tideprint/health/1',release:process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,12)??'local',scope:'Runtime response only. NOAA, timestamp calendars and Bitcoin verification are checked when requested.'}));
