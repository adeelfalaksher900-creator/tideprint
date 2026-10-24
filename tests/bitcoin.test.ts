import test, { type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { bitcoinHeader } from '../server/timestamp.ts';

const genesis = JSON.parse(await readFile(new URL('./fixtures/bitcoin-genesis.json', import.meta.url), 'utf8'));
const merkleRoot = Buffer.from(genesis.header, 'hex').subarray(36, 68);

function explorer(t: TestContext, header = genesis.header) {
  t.mock.method(globalThis, 'fetch', async (url: string | URL | Request) => {
    const path = String(url);
    if (path.endsWith('/block-height/0')) return new Response(genesis.hash);
    if (path.endsWith('/block/' + genesis.hash + '/header')) return new Response(header);
    if (path.endsWith('/blocks/tip/height')) return new Response('100');
    throw new Error('Unexpected explorer request');
  });
}

test('Bitcoin verifier accepts the known genesis header and matching Merkle commitment', async t => {
  explorer(t);
  const result = await bitcoinHeader(0, merkleRoot);
  assert.equal(result.blockHash, genesis.hash);
  assert.equal(result.time, '2009-01-03T18:15:05.000Z');
  assert.equal(result.confirmations, 101);
});

test('Bitcoin verifier rejects a receipt path that does not match the header Merkle root', async t => {
  explorer(t);
  await assert.rejects(bitcoinHeader(0, Buffer.alloc(32)), /does not match/);
});

test('Bitcoin verifier rejects an altered header even when the explorer advertises a trusted hash', async t => {
  const altered = Buffer.from(genesis.header, 'hex');
  altered[76] ^= 1;
  explorer(t, altered.toString('hex'));
  await assert.rejects(bitcoinHeader(0, merkleRoot), /does not match/);
});
