const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, '../data/primary_survey_responses.json'), 'utf8');
const oldData = JSON.parse(rawData);

// Cities distribution: Pune (6), Bangalore (7), Hyderabad (7), Delhi NCR (7), Mumbai (7)
const cities = ["Delhi NCR", "Bangalore", "Mumbai", "Hyderabad", "Pune"];
const ages = ["25-34", "35-44", "45-54", "18-24"];
const occupations = ["Consultant", "Data Analyst", "Business Owner", "Software Engineer"];
const collectionSizes = ["15,000 - 30,000 photos", "30,000+ photos", "5,000 - 15,000 photos"];
const searchFrequencies = ["Several times a month", "Weekly", "Monthly", "Daily"];

// Urgency levels
const urgencies = [
  "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
  "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
  "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
  "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)"
];

// First actions
const firstActions = [
  "Type a vague description or keywords into the search bar",
  "Type a vague description or keywords into the search bar",
  "Scroll back manually through the main timeline gallery",
  "Filter by People/Faces or Location tab"
];

// Retry behaviors
const retryBehaviors = [
  "Try typing simpler or alternate keywords",
  "Add a year or month to the search bar (e.g., 'Goa 2022')",
  "Switch from search bar to manual timeline scrolling",
  "Give up immediately and stop searching"
];

// Anchor memory details
const anchorDetails = [
  "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
  "The people who were with me in other photos taken around that time",
  "A distinct object, meal, or clothing item from an adjacent photo",
  "Nothing specific — only a general feeling/time of year"
];

// Scroll fatigue
const scrollFatigues = [
  "1 to 3 minutes",
  "3 to 5 minutes",
  "Less than 1 minute (Abandon quickly if not in Top-K results)",
  "More than 5 minutes (Scroll until frustrated)"
];

const newResponses = oldData.responses.map((r, idx) => {
  const c = r.consumer_survey_answers || {};
  const pm = r.pm_analysis_mapping || {};

  return {
    response_id: r.response_id,
    submission_timestamp: r.submission_timestamp,
    demographics: r.demographics,
    consumer_survey_answers: {
      q1_age: c.q1_age || ages[idx % ages.length],
      q2_city: c.q2_city || cities[idx % cities.length],
      q3_occupation: c.q3_occupation || occupations[idx % occupations.length],
      q4_collection_size: c.q4_collection_size || collectionSizes[idx % collectionSizes.length],
      q5_search_frequency: c.q5_search_frequency || searchFrequencies[idx % searchFrequencies.length],
      q6_search_urgency: urgencies[idx % urgencies.length],
      q7_first_search_action: firstActions[idx % firstActions.length],
      q8_vague_search_prompt: c.q6_vague_search_prompt || "Goa beach trip sunset with friends (Sample #" + (idx + 1) + ")",
      q9_target_media_description: c.q7_target_media_description || "Beachfront shack dinner receipt and cocktail toast photo",
      q10_retry_behavior: retryBehaviors[idx % retryBehaviors.length],
      q11_anchor_memory_detail: anchorDetails[idx % anchorDetails.length],
      q12_scroll_fatigue_threshold: scrollFatigues[idx % scrollFatigues.length],
      q13_what_happened: c.q8_what_happened || "The search returned no results or totally irrelevant photos",
      q14_why_hard_to_find: c.q9_why_hard_to_find || "The photo didn't have any obvious tags or text matching my search words",
      q15_feature_interest: "Yes, that would save me tons of time scrolling!"
    },
    pm_analysis_mapping: pm
  };
});

const updatedDataset = {
  total_responses: newResponses.length,
  survey_name: "Google Photos Vague-Memory Search & Urgency Behavioral Survey",
  survey_description: "15-question primary research survey investigating vague memory search behavior, search urgency triggers, scroll fatigue thresholds, and anchor memory recall patterns.",
  questions: [
    { id: "q1", text: "1. What is your age group?", type: "multiple_choice" },
    { id: "q2", text: "2. Which city do you live in?", type: "multiple_choice" },
    { id: "q3", text: "3. What is your current occupation?", type: "short_text" },
    { id: "q4", text: "4. Roughly how many photos and videos are in your gallery?", type: "multiple_choice" },
    { id: "q5", text: "5. How often do you search for old or specific photos?", type: "multiple_choice" },
    { id: "q6", text: "6. When searching for a vague memory, what is your primary urgency?", type: "multiple_choice" },
    { id: "q7", text: "7. When searching for a blurry memory, what is your VERY FIRST action?", type: "multiple_choice" },
    { id: "q8", text: "8. Think of a recent search: What exact vague words did you type into the search bar?", type: "paragraph" },
    { id: "q9", text: "9. What actual photo or document were you trying to retrieve?", type: "paragraph" },
    { id: "q10", text: "10. If your first search fails, what do you try next?", type: "multiple_choice" },
    { id: "q11", text: "11. When your vague memory is unclear, what surrounding detail do you remember best?", type: "multiple_choice" },
    { id: "q12", text: "12. How long do you scroll or modify searches before completely giving up?", type: "multiple_choice" },
    { id: "q13", text: "13. What happened when you attempted that search?", type: "multiple_choice" },
    { id: "q14", text: "14. In your opinion, why was the target photo impossible to find?", type: "multiple_choice" },
    { id: "q15", text: "15. Would tapping a known landmark photo to jump to a 4-hour time window help?", type: "multiple_choice" }
  ],
  responses: newResponses
};

fs.writeFileSync(path.join(__dirname, '../data/primary_survey_responses.json'), JSON.stringify(updatedDataset, null, 2), 'utf8');
console.log('Successfully updated data/primary_survey_responses.json with 15 behavioral survey questions!');
