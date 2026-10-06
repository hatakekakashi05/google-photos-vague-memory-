const path = require('path');
const RetrievalEngine = require('../src/retrieval_engine');

const datasetPath = path.join(__dirname, '../data/synthetic_photos_dataset.json');
const engine = new RetrievalEngine(datasetPath);

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const anchorId = req.query ? req.query.anchor_id : null;
  if (!anchorId) {
    return res.status(400).json({ error: 'Missing anchor_id parameter' });
  }

  const result = engine.expandContext(anchorId);
  return res.status(200).json(result);
};
