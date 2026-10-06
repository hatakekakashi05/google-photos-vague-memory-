const path = require('path');
const RetrievalEngine = require('../src/retrieval_engine');
const AIQueryParser = require('../src/ai_query_parser');

const datasetPath = path.join(__dirname, '../data/synthetic_photos_dataset.json');
const engine = new RetrievalEngine(datasetPath);
const parser = new AIQueryParser();

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(45).json({ error: 'Method not allowed' });
  }

  const rawQuery = req.body && req.body.query ? req.body.query : '';
  const signal = parser.parseQuery(rawQuery);
  const candidates = engine.searchCandidateAnchors(signal.retrieval_query_string, 5);

  return res.status(200).json({ signal, candidates });
};
