const fs = require('fs');
const path = require('path');

const surveyData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/primary_survey_responses.json'), 'utf8'));

const discoveryData = {
  tool_metadata: {
    tool_name: "Google Photos AI-Powered Discovery Engine",
    tool_role: "Internal PM Evidence Analysis & Gemini AI Problem Discovery Engine",
    target_problem: "CFM-01 (Vague-Memory Search & Surfacing Failure at Stage G1)",
    total_public_records: 41,
    user_failure_population_count: 34,
    counter_evidence_count: 2,
    framing_records_count: 5,
    governance_label: "Public-Evidence-Based PM Analysis — Not a Representative User Sample",
    narrative: "Consumer Behavioral Survey → Gemini AI Analysis → Failure Mode → Root Cause → Solution Design → MVP → Synthetic Benchmark → Experimentation Roadmap"
  },
  stage_breakdown: [
    {
      stage_id: "STAGE_G1",
      stage_name: "Stage G1: Query Formulation & Initial Search Surfacing",
      failure_count: 23,
      percentage: 67.6,
      description: "Vague memory prompt enters search bar, but un-tagged target media fails to surface in initial Top-K results.",
      severity: "CRITICAL",
      urgency_profile: "High Urgency (Official receipts, documents, paper bills) - 78% of G1 failures"
    },
    {
      stage_id: "STAGE_G2",
      stage_name: "Stage G2: Candidate Result Browsing & Inspection",
      failure_count: 7,
      percentage: 20.6,
      description: "Search returns partial candidates, but session is abandoned due to lack of contextual timeline navigation affordance.",
      severity: "MAJOR",
      urgency_profile: "Moderate Urgency (Showing photos to friends/family nearby)"
    },
    {
      stage_id: "STAGE_G3",
      stage_name: "Stage G3: Timeline Navigation & Context Expansion",
      failure_count: 4,
      percentage: 11.8,
      description: "User attempts manual date scrolling in gallery timeline, losing anchor position or encountering missing EXIF metadata.",
      severity: "MODERATE",
      urgency_profile: "Low Urgency (Casual nostalgic browsing / old vacation trips)"
    }
  ],
  metric_decomposition: {
    primary_metric: "User VMRSR (User Vague-Memory Retrieval Success Rate)",
    formula: "User VMRSR = (Unique active users with ≥1 vague search AND ≥1 operational retrieval success) / (Unique active users with ≥1 vague search)",
    sub_metrics: [
      { name: "Candidate Anchor Discovery Rate (ADR)", target: "≥ 60.0%" },
      { name: "Target Context Reachability Rate", target: "≥ 50.0%" },
      { name: "Edge-Case Handling Pass Rate", target: "100.0%" }
    ]
  },
  search_urgency_analytics: {
    high_urgency_count: 17,
    moderate_urgency_count: 9,
    low_urgency_count: 8,
    scroll_fatigue_thresholds: [
      { threshold: "Less than 1 minute", percentage: 26.5, user_count: 9, impact: "Immediate search abandonment" },
      { threshold: "1 to 3 minutes", percentage: 50.0, user_count: 17, impact: "Critical drop-off cliff" },
      { threshold: "3 to 5 minutes", percentage: 14.7, user_count: 5, impact: "Frustrated manual timeline scroll" },
      { threshold: "More than 5 minutes", percentage: 8.8, user_count: 3, impact: "Session abandonment" }
    ],
    anchor_memory_types: [
      { type: "Landmark / Location from earlier that day", count: 18, percentage: 52.9 },
      { type: "People present in adjacent photos", count: 9, percentage: 26.5 },
      { type: "Distinct object / meal in nearby photo", count: 5, percentage: 14.7 },
      { type: "General season / time of year", count: 2, percentage: 5.9 }
    ]
  },
  survey_demographics: {
    total_responses: 34,
    survey_name: "Google Photos Vague-Memory Search & Urgency Behavioral Survey",
    google_form_url: "/google_form.html",
    cities: [
      { name: "Delhi NCR", count: 7, percentage: 20.6 },
      { name: "Bangalore", count: 7, percentage: 20.6 },
      { name: "Mumbai", count: 7, percentage: 20.6 },
      { name: "Hyderabad", count: 7, percentage: 20.6 },
      { name: "Pune", count: 6, percentage: 17.6 }
    ],
    age_groups: [
      { range: "25-34", count: 9, percentage: 26.5 },
      { range: "35-44", count: 9, percentage: 26.5 },
      { range: "45-54", count: 8, percentage: 23.5 },
      { range: "18-24", count: 8, percentage: 23.5 }
    ],
    occupations: [
      { title: "Consultant", count: 9, percentage: 26.5 },
      { title: "Data Analyst", count: 9, percentage: 26.5 },
      { title: "Business Owner", count: 8, percentage: 23.5 },
      { title: "Software Engineer", count: 8, percentage: 23.5 }
    ]
  },
  responses: surveyData.responses
};

fs.writeFileSync(path.join(__dirname, '../apps/discovery-engine/data/discovery_engine_data.json'), JSON.stringify(discoveryData, null, 2), 'utf8');
console.log('Successfully updated apps/discovery-engine/data/discovery_engine_data.json!');
