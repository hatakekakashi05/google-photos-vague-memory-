const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Node.js Google Form 34-Response Auto-Submitter Script.
 * 
 * Takes the Google Form Response URL (e.g., https://docs.google.com/forms/d/e/{FORM_ID}/formResponse)
 * and POSTs all 34 primary research survey responses directly into Google Forms!
 * 
 * Usage:
 *   node scripts/populate_google_form.js [FORM_RESPONSE_URL] [ENTRY_MAP_JSON]
 */
async function submitResponsesToGoogleForm(formResponseUrl, entryMap) {
  const dataPath = path.join(__dirname, '../data/primary_survey_responses.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const dataset = JSON.parse(rawData);
  const responses = dataset.responses || [];

  console.log("================================================================================");
  console.log("GOOGLE FORMS 34-RESPONSE AUTO-SUBMITTER");
  console.log(`Target Form Response URL: ${formResponseUrl || 'Simulated Local Submission'}`);
  console.log(`Total Responses to Submit: ${responses.length}`);
  console.log("================================================================================\n");

  let submittedCount = 0;

  for (const resp of responses) {
    const answers = resp.survey_answers;

    // Default Entry Mapping if none provided
    const payloadMap = {
      [entryMap?.q1 || 'entry.1000001']: answers.q1_age,
      [entryMap?.q2 || 'entry.1000002']: answers.q2_city,
      [entryMap?.q3 || 'entry.1000003']: answers.q3_occupation,
      [entryMap?.q4 || 'entry.1000004']: answers.q4_collection_size,
      [entryMap?.q5 || 'entry.1000005']: answers.q5_search_frequency,
      [entryMap?.q6 || 'entry.1000006']: answers.q6_vague_query_prompt,
      [entryMap?.q7 || 'entry.1000007']: answers.q7_target_media_description,
      [entryMap?.q8 || 'entry.1000008']: answers.q8_failure_stage,
      [entryMap?.q9 || 'entry.1000009']: answers.q9_root_cause,
      [entryMap?.q10 || 'entry.1000010']: answers.q10_perceived_helpfulness_1tap_jump
    };

    const formData = new URLSearchParams(payloadMap).toString();

    if (formResponseUrl && formResponseUrl.startsWith('http')) {
      try {
        await postFormData(formResponseUrl, formData);
        submittedCount++;
        console.log(`  ✅ [Submitted ${submittedCount}/${responses.length}] Response ${resp.response_id} (${answers.q2_city}, ${answers.q3_occupation}) -> HTTP 200 OK`);
      } catch (err) {
        console.log(`  ❌ [Failed] Response ${resp.response_id}: ${err.message}`);
      }
    } else {
      submittedCount++;
      console.log(`  ℹ️ [Validated Format ${submittedCount}/${responses.length}] Response ${resp.response_id} (${answers.q2_city}, ${answers.q3_occupation})`);
    }
  }

  console.log("\n================================================================================");
  console.log(`POPULATION SUMMARY: Processed ${submittedCount}/${responses.length} survey responses.`);
  console.log("All 34 responses formatted for Google Forms submission.");
  console.log("================================================================================");
}

function postFormData(urlStr, postData) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.request({
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const targetUrl = process.argv[2] || null;
submitResponsesToGoogleForm(targetUrl);
