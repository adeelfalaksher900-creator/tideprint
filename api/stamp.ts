import { endpoint, bodyObject } from '../server/http.ts';
import { stamp } from '../server/timestamp.ts';
export default endpoint('POST',req=>{const b=bodyObject(req);return stamp(b.digest);});
