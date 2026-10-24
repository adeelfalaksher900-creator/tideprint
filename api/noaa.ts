import { endpoint } from '../server/http.ts';
import { getNOAA } from '../server/noaa.ts';
export default endpoint('GET',req=>getNOAA(req.query?.station,req.query?.date),{cacheControlOnSuccess:'public, max-age=0, s-maxage=300, stale-while-revalidate=600'});
