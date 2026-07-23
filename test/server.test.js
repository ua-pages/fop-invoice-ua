import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

const PORT = 8081;
const BASE = `http://localhost:${PORT}`;
let server;

before(() => {
  process.env.PORT = PORT;
  return import('../server.js').then(mod => {
    server = mod.server;
    return new Promise(resolve => {
      if (server.listening) resolve();
      else server.on('listening', resolve);
    });
  });
});

after(() => {
  if (server) server.close();
});

function fetch(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE}${path}`, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

describe('server', () => {
  it('serves index.html at /', async () => {
    const res = await fetch('/');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.body, /ФОП Інвойси/);
  });

  it('returns 404 for unknown paths', async () => {
    const res = await fetch('/nonexistent');
    assert.equal(res.status, 404);
  });

  it('serves JS files with correct MIME type', async () => {
    const res = await fetch('/db.js');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/javascript/);
  });
});
