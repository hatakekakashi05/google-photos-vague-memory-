const scenarios = [
  {
    scenario_id: 'SCENARIO_1',
    scenario_name: 'Scenario 1: Beach Trip Sunset',
    raw_query: 'That trip to Goa beach with friends where we watched the sunset and later went for dinner'
  },
  {
    scenario_id: 'SCENARIO_2',
    scenario_name: 'Scenario 2: Mountain Hike Dinner',
    raw_query: 'Hiking trip in Yosemite mountains near mist trail where we ate hot soup for dinner'
  },
  {
    scenario_id: 'SCENARIO_3',
    scenario_name: 'Scenario 3: Missing EXIF Vintage Family',
    raw_query: 'Scanned vintage photo of family reunion with grandparents'
  },
  {
    scenario_id: 'SCENARIO_4',
    scenario_name: 'Scenario 4: Sparse Context Office Document',
    raw_query: 'Receipt or office document lying on the work desk'
  },
  {
    scenario_id: 'SCENARIO_5',
    scenario_name: 'Scenario 5: Multi-Event Overlap Birthday',
    raw_query: 'Birthday party with cake and candles evening celebration'
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(scenarios);
};
