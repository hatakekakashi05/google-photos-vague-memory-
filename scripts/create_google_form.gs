/**
 * GOOGLE APPS SCRIPT: Auto-Create Vague-Memory Photo Retrieval Primary Research Survey
 * 
 * Instructions:
 * 1. Open https://script.google.com and click 'New Project'.
 * 2. Paste this code into Code.gs and click 'Run' -> `createVagueMemorySurvey()`.
 * 3. The script creates the Google Form in Google Drive, links it to Google Sheets,
 *    and logs the Form URL and Pre-Filled Entry IDs to the Execution Log!
 */
function createVagueMemorySurvey() {
  const form = FormApp.create('Google Photos Vague-Memory Retrieval Primary Research Survey');
  form.setDescription('Primary research survey studying vague-memory search friction, target photo retrieval bottlenecks, and timeline navigation patterns in photo archives.');
  form.setConfirmationMessage('Thank you for completing the primary research survey! Your response has been recorded.');

  // Q1: Age Group
  const q1 = form.addMultipleChoiceItem();
  q1.setTitle('1. What is your age group?')
    .setChoices([
      q1.createChoice('18-24'),
      q1.createChoice('25-34'),
      q1.createChoice('35-44'),
      q1.createChoice('45-54'),
      q1.createChoice('55+')
    ])
    .setRequired(true);

  // Q2: City / Location
  const q2 = form.addMultipleChoiceItem();
  q2.setTitle('2. Which city are you currently located in?')
    .setChoices([
      q2.createChoice('Pune'),
      q2.createChoice('Bangalore'),
      q2.createChoice('Hyderabad'),
      q2.createChoice('Delhi NCR'),
      q2.createChoice('Mumbai'),
      q2.createChoice('Other')
    ])
    .setRequired(true);

  // Q3: Occupation
  const q3 = form.addTextItem();
  q3.setTitle('3. What is your current occupation?')
    .setRequired(true);

  // Q4: Photo Collection Size
  const q4 = form.addMultipleChoiceItem();
  q4.setTitle('4. Approximately how many photos/videos are in your personal photo library?')
    .setChoices([
      q4.createChoice('Under 5,000 photos'),
      q4.createChoice('5,000 - 15,000 photos'),
      q4.createChoice('15,000 - 30,000 photos'),
      q4.createChoice('30,000+ photos')
    ])
    .setRequired(true);

  // Q5: Search Frequency
  const q5 = form.addMultipleChoiceItem();
  q5.setTitle('5. How frequently do you attempt to search for specific old or forgotten photos?')
    .setChoices([
      q5.createChoice('Daily'),
      q5.createChoice('Weekly'),
      q5.createChoice('Monthly'),
      q5.createChoice('Rarely')
    ])
    .setRequired(true);

  // Q6: Vague Query Prompt
  const q6 = form.addParagraphTextItem();
  q6.setTitle('6. Vague Search Prompt: What keywords/phrases do you type when trying to find a forgotten photo?')
    .setHelpText('Example: "Goa beach trip sunset with friends" or "hiking in mountains dinner"')
    .setRequired(true);

  // Q7: Target Media Description
  const q7 = form.addParagraphTextItem();
  q7.setTitle('7. Target Media Description: What specific item, document, or photo were you actually trying to locate?')
    .setHelpText('Example: "Beachfront shack dinner receipt" or "photo of grandparents scanned print"')
    .setRequired(true);

  // Q8: Failure Stage Experienced
  const q8 = form.addMultipleChoiceItem();
  q8.setTitle('8. At which stage did your retrieval attempt fail or stall?')
    .setChoices([
      q8.createChoice('Stage G1: Query Formulation & Initial Search Surfacing (Search returned zero or irrelevant results)'),
      q8.createChoice('Stage G2: Candidate Browsing & Inspection (Browsed results but abandoned without finding target)'),
      q8.createChoice('Stage G3: Timeline Navigation & Context Expansion (Attempted manual date scrolling in gallery timeline)')
    ])
    .setRequired(true);

  // Q9: Primary Retrieval Bottleneck / Root Cause
  const q9 = form.addMultipleChoiceItem();
  q9.setTitle('9. What was the primary root cause or bottleneck for the retrieval failure?')
    .setChoices([
      q9.createChoice('Un-tagged Target Photo (Target object/item was not tagged in photo metadata)'),
      q9.createChoice('Missing GPS EXIF (Photo lacked GPS location coordinates)'),
      q9.createChoice('Missing Timestamp EXIF (Scanned or historical photo lacked original date metadata)'),
      q9.createChoice('Sparse Context (No anchor landmark photo in 4-hour window)'),
      q9.createChoice('Multi-Event Overlap (Competing event at same location caused context confusion)')
    ])
    .setRequired(true);

  // Q10: Perceived Helpfulness of 1-Tap Timeline Context Jump
  const q10 = form.addMultipleChoiceItem();
  q10.setTitle('10. Would a "1-Tap Contextual Jump & Expand" feature (jumping from a memorable anchor photo to its timeline window) help solve this?')
    .setChoices([
      q10.createChoice('Yes - Very Helpful (Would save 5-10 mins of timeline scrolling)'),
      q10.createChoice('Somewhat Helpful'),
      q10.createChoice('Not Helpful')
    ])
    .setRequired(true);

  Logger.log('================================================================================');
  Logger.log('GOOGLE FORM CREATED SUCCESSFULLY:');
  Logger.log('Form Edit URL : ' + form.getEditUrl());
  Logger.log('Form Public Published URL : ' + form.getPublishedUrl());
  Logger.log('Form Submit Response URL  : ' + form.getPublishedUrl().replace('/viewform', '/formResponse'));
  Logger.log('================================================================================');
  
  // Log Item IDs for HTTP POST Pre-Filled Population Script
  const items = form.getItems();
  items.forEach(function(item) {
    Logger.log('Question: "' + item.getTitle() + '" -> Entry ID: entry.' + item.getId());
  });
}
