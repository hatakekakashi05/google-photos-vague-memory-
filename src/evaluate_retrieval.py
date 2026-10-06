import json
from retrieval_engine import RetrievalEngine

def run_retrieval_evaluation():
    dataset_path = 'c:/Users/Amar/Desktop/workspaceforag/res/data/synthetic_photos_dataset.json'
    engine = RetrievalEngine(dataset_path)
    
    with open(dataset_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    all_photos = data['photos']
    
    test_scenarios = [
        {
            'scenario_name': 'Scenario 1: Beach Trip Sunset',
            'query': 'beach trip sunset friends',
            'target_id': 'GOA_004',
            'expected_anchor_id': 'GOA_001'
        },
        {
            'scenario_name': 'Scenario 2: Mountain Hike Dinner',
            'query': 'hiking mountains dinner soup',
            'target_id': 'HIKE_003',
            'expected_anchor_id': 'HIKE_001'
        },
        {
            'scenario_name': 'Scenario 3: Missing EXIF Vintage Family',
            'query': 'scanned vintage family reunion',
            'target_id': 'NOEXIF_002',
            'expected_anchor_id': 'NOEXIF_001'
        },
        {
            'scenario_name': 'Scenario 4: Sparse Context Office Document',
            'query': 'receipt office document desk',
            'target_id': 'SPARSE_001',
            'expected_anchor_id': 'SPARSE_001'
        },
        {
            'scenario_name': 'Scenario 5: Multi-Event Overlap Birthday',
            'query': 'birthday cake candles party',
            'target_id': 'OVERLAP_002',
            'expected_anchor_id': 'OVERLAP_001'
        }
    ]
    
    print("=" * 80)
    print("AI-NATIVE PROTOTYPE RETRIEVAL & GROUND-TRUTH EVALUATION REPORT")
    print("Governance Rule: Ground-truth labels are excluded from ranking & retrieval.")
    print("=" * 80)
    
    total_evals = len(test_scenarios)
    anchors_found_count = 0
    targets_reached_count = 0
    
    for test in test_scenarios:
        print(f"\nEvaluating {test['scenario_name']}...")
        print(f" Query: '{test['query']}'")
        
        # 1. Search candidate anchors without passing ground truth
        anchors = engine.search_candidate_anchors(test['query'], top_k=3)
        retrieved_ids = [a['photo_id'] for a in anchors]
        print(f" Candidate Anchors Surfaced: {retrieved_ids}")
        
        anchor_hit = test['expected_anchor_id'] in retrieved_ids
        if anchor_hit:
            anchors_found_count += 1
            print(f"  ✅ Anchor Discovery HIT: Surfaced expected anchor ({test['expected_anchor_id']})")
        else:
            print(f"  ❌ Anchor Discovery MISS: Expected {test['expected_anchor_id']}")
            
        # 2. Test Context Expansion from top anchor
        if anchors:
            top_anchor = anchors[0]['photo_id']
            context_res = engine.expand_context(top_anchor)
            print(f" Context Expansion Status for {top_anchor}: {context_res['status']}")
            
            context_item_ids = [cp['photo_id'] for cp in context_res.get('photos', [])]
            target_hit = test['target_id'] in context_item_ids or test['target_id'] == top_anchor
            
            if target_hit:
                targets_reached_count += 1
                print(f"  ✅ Target Retrieval HIT: Target photo ({test['target_id']}) reachable from context window")
            else:
                print(f"  ⚠️ Target Retrieval Info: Target ({test['target_id']}) status: {context_res['status']}")
        print("-" * 80)
        
    print("\nEVALUATION SUMMARY RESULTS:")
    print(f" Total Evaluation Scenarios: {total_evals}")
    print(f" Candidate Anchor Discovery Rate (ADR Proxy): {anchors_found_count / total_evals * 100:.1f}% ({anchors_found_count}/{total_evals})")
    print(f" Target Context Reachability Rate: {targets_reached_count / total_evals * 100:.1f}% ({targets_reached_count}/{total_evals})")
    print("=" * 80)

if __name__ == '__main__':
    run_retrieval_evaluation()
