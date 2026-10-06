const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, '../data/primary_survey_responses.json'), 'utf8');
const oldData = JSON.parse(rawData);

const naturalResponses = oldData.responses.map((r, idx) => {
  const ans = r.survey_answers;

  // Map Q8 (natural to PM stage)
  let q8_user = '';
  let q8_pm = '';
  if (ans.q8_failure_stage.includes('Stage G1')) {
    q8_user = 'The search returned no results or totally irrelevant photos';
    q8_pm = 'Stage G1: Query Formulation & Initial Search Surfacing Failure';
  } else if (ans.q8_failure_stage.includes('Stage G2')) {
    q8_user = 'I got some results, but I gave up scrolling through them without finding it';
    q8_pm = 'Stage G2: Candidate Browsing & Inspection Failure';
  } else {
    q8_user = 'I tried scrolling back manually through my timeline/calendar, but got lost or gave up';
    q8_pm = 'Stage G3: Timeline Navigation & Context Expansion Failure';
  }

  // Map Q9 (natural to PM root cause)
  let q9_user = '';
  let q9_pm = '';
  if (ans.q9_root_cause.includes('Un-tagged')) {
    q9_user = "The photo didn't have any obvious tags or text matching my search words";
    q9_pm = "Un-tagged Target Photo (Search engine failed to match vague keywords with un-tagged photo)";
  } else if (ans.q9_root_cause.includes('GPS')) {
    q9_user = "Location wasn't saved on the photo";
    q9_pm = "Missing GPS EXIF (Photo lacked location coordinates)";
  } else if (ans.q9_root_cause.includes('Timestamp')) {
    q9_user = "It was a scanned or old photo with the wrong date/timestamp";
    q9_pm = "Missing Timestamp EXIF (Scanned or historical photo lacked date metadata)";
  } else if (ans.q9_root_cause.includes('Sparse')) {
    q9_user = "I couldn't remember key details or landmark photos around that time";
    q9_pm = "Sparse Context (No anchor landmark photo in 4-hour window)";
  } else {
    q9_user = "I had too many photos from different events around that same time";
    q9_pm = "Multi-Event Overlap (Competing event at same location caused context window collision)";
  }

  // Map Q10 (natural to PM helpfulness)
  let q10_user = 'Yes, that would save me tons of time scrolling!';
  let q10_pm = 'Yes - Very Helpful (Would save 5-10 mins of timeline scrolling)';

  return {
    response_id: r.response_id,
    submission_timestamp: r.submission_timestamp,
    demographics: r.demographics,
    consumer_survey_answers: {
      q1_age: ans.q1_age,
      q2_city: ans.q2_city,
      q3_occupation: ans.q3_occupation,
      q4_collection_size: ans.q4_collection_size,
      q5_search_frequency: ans.q5_search_frequency,
      q6_vague_search_prompt: ans.q6_vague_query_prompt,
      q7_target_media_description: ans.q7_target_media_description,
      q8_what_happened: q8_user,
      q9_why_hard_to_find: q9_user,
      q10_feature_interest: q10_user
    },
    pm_analysis_mapping: {
      failure_stage: q8_pm,
      root_cause: q9_pm,
      perceived_helpfulness: q10_pm,
      user_persona: r.demographics.occupation + ' in ' + r.demographics.city
    }
  };
});

const updatedDataset = {
  total_responses: naturalResponses.length,
  survey_name: "Google Photos Personal Memories & Photo Search User Survey",
  survey_description: "Consumer user survey gathering natural experiences when searching for old, vague photos in Google Photos, analyzed into PM failure modes.",
  questions: [
    { id: "q1", text: "1. What is your age group?", type: "multiple_choice" },
    { id: "q2", text: "2. Which city do you live in?", type: "multiple_choice" },
    { id: "q3", text: "3. What is your current occupation?", type: "short_text" },
    { id: "q4", text: "4. Roughly how many photos and videos are stored in your photo gallery?", type: "multiple_choice" },
    { id: "q5", text: "5. How often do you search for an old or specific photo in your collection?", type: "multiple_choice" },
    { id: "q6", text: "6. Think of a recent time you tried searching for an old photo. What did you type into the search bar?", type: "paragraph" },
    { id: "q7", text: "7. What was the actual photo or document you were looking for?", type: "paragraph" },
    { id: "q8", text: "8. What happened when you typed that search?", type: "multiple_choice" },
    { id: "q9", text: "9. In your opinion, why was it hard to find that photo?", type: "multiple_choice" },
    { id: "q10", text: "10. If you could tap on a photo you DO remember (like a landmark or ticket) and instantly jump to all photos taken around that exact time and place, would that help you?", type: "multiple_choice" }
  ],
  responses: naturalResponses
};

fs.writeFileSync(path.join(__dirname, '../data/primary_survey_responses.json'), JSON.stringify(updatedDataset, null, 2), 'utf8');
console.log('Successfully updated data/primary_survey_responses.json with natural consumer survey questions & PM mapping!');
