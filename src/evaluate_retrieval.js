const path = require('path');
const RetrievalEngine = require('./retrieval_engine');

function runRetrievalEvaluation() {
  const datasetPath = path.join(__dirname, '../data/synthetic_photos_dataset.json');
  const engine = new RetrievalEngine(datasetPath);

  const testScenarios = [
    {
      scenario_id: 'SCENARIO_1',
      scenario_name: 'Scenario 1: Beach Trip Sunset',
      query: 'beach trip sunset friends',
      expected_anchor_id: 'GOA_001',
      expected_target_id: 'GOA_004',
      scenario_type: 'ANCHOR_TO_TARGET'
    },
    {
      scenario_id: 'SCENARIO_2',
      scenario_name: 'Scenario 2: Mountain Hike Dinner',
      query: 'hiking mountains dinner soup',
      expected_anchor_id: 'HIKE_001',
      expected_target_id: 'HIKE_003',
      scenario_type: 'ANCHOR_TO_TARGET'
    },
    {
      scenario_id: 'SCENARIO_3',
      scenario_name: 'Scenario 3: Missing EXIF Vintage Family',
      query: 'scanned vintage family reunion',
      expected_anchor_id: 'NOEXIF_001',
      expected_target_id: 'NOEXIF_002',
      scenario_type: 'EDGE_CASE_MISSING_EXIF'
    },
    {
      scenario_id: 'SCENARIO_4',
      scenario_name: 'Scenario 4: Sparse Context Office Document',
      query: 'receipt office document desk',
      expected_anchor_id: 'SPARSE_001',
      expected_target_id: null, // No separate target photo
      scenario_type: 'EDGE_CASE_SPARSE_CONTEXT'
    },
    {
      scenario_id: 'SCENARIO_5',
      scenario_name: 'Scenario 5: Multi-Event Overlap Birthday',
      query: 'birthday cake candles party',
      expected_anchor_id: 'OVERLAP_001',
      expected_target_id: 'OVERLAP_002',
      competing_event: 'Morning Conference',
      scenario_type: 'EDGE_CASE_MULTI_EVENT'
    }
  ];

  console.log("=" .repeat(80));
  console.log("AI-NATIVE PROTOTYPE RETRIEVAL & GROUND-TRUTH EVALUATION REPORT (GOVERNED)");
  console.log("Governance Rule: Ground-truth labels are excluded from ranking & retrieval.");
  console.log("Governance Rule: Anchor discovery requires surfacing the expected anchor.");
  console.log("Governance Rule: Context reachability must originate from the expected anchor.");
  console.log("=" .repeat(80));

  let anchorHitCount = 0;
  let contextReachabilityHitCount = 0;
  let edgeCasePassCount = 0;
  
  let anchorNavScenariosCount = 0; // Scenarios testing anchor-to-target navigation

  for (const test of testScenarios) {
    console.log(`\nEvaluating ${test.scenario_name}...`);
    console.log(` Query: '${test.query}'`);

    // 1. Candidate Anchor Retrieval (without passing ground-truth labels)
    const candidates = engine.searchCandidateAnchors(test.query, 3);
    const candidateIds = candidates.map(c => c.photo_id);
    console.log(` Top-3 Candidate Results Surfaced: ${candidateIds.join(', ')}`);

    // Evaluate Anchor Discovery HIT
    const anchorSurfaced = candidateIds.includes(test.expected_anchor_id);
    if (anchorSurfaced) {
      anchorHitCount++;
      console.log(`  ✅ Anchor Discovery HIT: Expected anchor (${test.expected_anchor_id}) SURFACED in top-3 candidates`);
    } else {
      console.log(`  ❌ Anchor Discovery MISS: Expected anchor (${test.expected_anchor_id}) NOT SURFACED in top-3 candidates`);
    }

    // Check if target was directly surfaced in search results (observation only, not anchor hit)
    if (test.expected_target_id && candidateIds.includes(test.expected_target_id)) {
      console.log(`  ℹ️ Observation: Target photo (${test.expected_target_id}) DIRECTLY SURFACED in search results (does not substitute for anchor)`);
    }

    // 2. Context Reachability / Edge-Case Handling from expected anchor
    if (test.scenario_type === 'ANCHOR_TO_TARGET') {
      anchorNavScenariosCount++;
      const contextRes = engine.expandContext(test.expected_anchor_id);
      const contextItemIds = (contextRes.photos || []).map(p => p.photo_id);
      console.log(` Context Expansion from Expected Anchor (${test.expected_anchor_id}) Status: ${contextRes.status}`);
      console.log(`  Context Grid Items Surfaced: ${contextItemIds.join(', ')}`);

      const targetReachable = contextItemIds.includes(test.expected_target_id);
      if (targetReachable) {
        contextReachabilityHitCount++;
        console.log(`  ✅ Target Context Reachability HIT: Target (${test.expected_target_id}) REACHABLE from anchor context window`);
      } else {
        console.log(`  ❌ Target Context Reachability MISS: Target (${test.expected_target_id}) NOT in anchor context window`);
      }
    } else if (test.scenario_type === 'EDGE_CASE_MISSING_EXIF') {
      const contextRes = engine.expandContext(test.expected_anchor_id);
      if (contextRes.status === 'MISSING_EXIF_FALLBACK') {
        edgeCasePassCount++;
        console.log(`  ✅ Edge-Case Handling PASS: Correctly triggered MISSING_EXIF_FALLBACK ('View Date in Timeline')`);
      } else {
        console.log(`  ❌ Edge-Case Handling FAIL: Unexpected status ${contextRes.status}`);
      }
    } else if (test.scenario_type === 'EDGE_CASE_SPARSE_CONTEXT') {
      const contextRes = engine.expandContext(test.expected_anchor_id);
      if (contextRes.status === 'SPARSE_CONTEXT') {
        edgeCasePassCount++;
        console.log(`  ✅ Edge-Case Handling PASS: Correctly identified SPARSE_CONTEXT ('No Additional Photos Found')`);
      } else {
        console.log(`  ❌ Edge-Case Handling FAIL: Unexpected status ${contextRes.status}`);
      }
    } else if (test.scenario_type === 'EDGE_CASE_MULTI_EVENT') {
      const contextRes = engine.expandContext(test.expected_anchor_id);
      // Morning conference anchor (09:30 Delhi) vs Evening birthday target (20:15 Gurgaon > 10 hrs / different city)
      if (contextRes.status === 'SPARSE_CONTEXT' || !(contextRes.photos || []).map(p => p.photo_id).includes(test.expected_target_id)) {
        edgeCasePassCount++;
        console.log(`  ✅ Edge-Case Handling PASS: Correctly isolated morning event from un-clustered evening event (${contextRes.status})`);
      } else {
        console.log(`  ❌ Edge-Case Handling FAIL: Failed to isolate distinct multi-events`);
      }
    }
    console.log("-" .repeat(80));
  }

  console.log("\nSYNTHETIC PROTOTYPE BENCHMARK RESULTS (RECALCULATED):");
  console.log(` Total Evaluation Scenarios: ${testScenarios.length}`);
  console.log(` Anchor Discovery Rate (ADR Proxy): ${(anchorHitCount / testScenarios.length * 100).toFixed(1)}% (${anchorHitCount}/${testScenarios.length})`);
  console.log(` Target Context Reachability Rate (Anchor-to-Target Scenarios): ${(contextReachabilityHitCount / anchorNavScenariosCount * 100).toFixed(1)}% (${contextReachabilityHitCount}/${anchorNavScenariosCount})`);
  console.log(` Edge-Case Handling Pass Rate: ${(edgeCasePassCount / 3 * 100).toFixed(1)}% (${edgeCasePassCount}/3)`);
  console.log("=" .repeat(80));
}

runRetrievalEvaluation();
