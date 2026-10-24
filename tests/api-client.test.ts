import test from 'node:test';import assert from 'node:assert/strict';
import {api} from '../src/core/api.ts';
test('edge HTML rate-limit responses produce a useful recovery message',async t=>{t.mock.method(globalThis,'fetch',async()=>new Response('<html>limited</html>',{status:429}));await assert.rejects(api('/api/noaa'),/Wait one minute/);});
test('request timeout and network failure preserve clear user-facing guidance',async t=>{t.mock.method(globalThis,'fetch',async()=>{throw new DOMException('aborted','TimeoutError');});await assert.rejects(api('/api/noaa'),/work is safe/);t.mock.restoreAll();t.mock.method(globalThis,'fetch',async()=>{throw new TypeError('fetch failed');});await assert.rejects(api('/api/noaa'),/Check your connection/);});
