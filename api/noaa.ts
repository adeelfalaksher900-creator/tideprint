import { endpoint } from '../server/http.ts';
import { getNOAA } from '../server/noaa.ts';
export default endpoint('GET',req=>getNOAA(req.query?.station,req.query?.date));
