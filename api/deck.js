const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const dataPath = path.join(__dirname, '../data/slide_deck.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load slide deck data', details: err.message });
  }
};
