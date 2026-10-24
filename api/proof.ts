import { endpoint, bodyObject } from '../server/http.ts';
import { inspectProof } from '../server/timestamp.ts';
export default endpoint('POST',req=>{const b=bodyObject(req);return inspectProof(b.digest,b.proof,b.upgrade??false);});
