import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyBundle} from '../src/core/receipt.ts';

test('accepted proof attachments are canonical, exportable and within the API decoded-byte limit',async()=>{
 const receipt=JSON.parse(readFileSync(new URL('../examples/confirmed-noaa-review.receipt.json',import.meta.url),'utf8'));
 for(const proof of ['A','AA','AA=','AB==','A===','!!!!','YQ==\n',null,btoa('x'.repeat(65537))]){
  await assert.rejects(verifyBundle({...receipt,proof}),/canonical base64.*64 KiB/);
 }
 const maximum=await verifyBundle({...receipt,proof:btoa('\0'.repeat(65536))});
 assert.equal(atob(maximum.proof!).length,65536);
 assert.equal((await verifyBundle(receipt)).proof,receipt.proof);
});
