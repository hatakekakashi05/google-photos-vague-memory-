const http = require('http');
const fs = require('fs');
const path = require('path');
const RetrievalEngine = require('./src/retrieval_engine');
const AIQueryParser = require('./src/ai_query_parser');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATASET_PATH = path.join(__dirname, 'data/synthetic_photos_dataset.json');

const engine = new RetrievalEngine(DATASET_PATH);
const parser = new AIQueryParser();

const scenarios = [
  {
    scenario_id: 'SCENARIO_1',
    scenario_name: 'Goa Beach Sunset',
    raw_query: 'That trip to Goa beach with friends where we watched the sunset and later went for dinner'
  },
  {
    scenario_id: 'SCENARIO_2',
    scenario_name: 'Yosemite Mountain Hike',
    raw_query: 'Hiking trip in Yosemite mountains near mist trail where we ate hot soup for dinner'
  },
  {
    scenario_id: 'SCENARIO_3',
    scenario_name: 'Vintage Family Reunion',
    raw_query: 'Scanned vintage photo of family reunion with grandparents'
  },
  {
    scenario_id: 'SCENARIO_4',
    scenario_name: 'Office Desk Expense Receipt',
    raw_query: 'Receipt or office document lying on the work desk'
  },
  {
    scenario_id: 'SCENARIO_5',
    scenario_name: 'Birthday Party Evening',
    raw_query: 'Birthday party with cake and candles evening celebration'
  }
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/scenarios' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(scenarios));
    return;
  }

  if (pathname === '/api/search' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const rawQuery = payload.query || '';
        const signal = parser.parseQuery(rawQuery);
        const candidates = engine.searchCandidateAnchors(signal.retrieval_query_string, 5);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ signal, candidates }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  if (pathname === '/api/expand' && req.method === 'GET') {
    const anchorId = parsedUrl.searchParams.get('anchor_id');
    if (!anchorId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing anchor_id parameter' }));
      return;
    }

    const result = engine.expandContext(anchorId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`================================================================================`);
  console.log(`APP 2 — GOOGLE PHOTOS RETRIEVAL MVP SERVER (UI #2)`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Concept A Solution Prototype (±4.0h, ≤1.0km context expansion)`);
  console.log(`================================================================================`);
});
