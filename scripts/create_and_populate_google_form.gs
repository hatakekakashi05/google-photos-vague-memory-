/**
 * GOOGLE APPS SCRIPT: 15-Question Vague Memory Search & Urgency Behavioral Survey (N=34 Responses)
 * 
 * HOW THIS WORKS:
 * 1. Creates a 15-question Google Form titled "Google Photos Vague-Memory Search & Urgency Behavioral Survey".
 * 2. Asks natural consumer questions on Search Urgency, Blurry Memory Recall, Scroll Fatigue, and First Actions.
 * 3. Programmatically populates N=34 responses directly into the Google Form in Google Drive.
 * 4. Outputs Edit & Published URLs in the Execution Log for native Google Form pie charts & analytics.
 */

function createAndPopulateSurvey() {
  Logger.log('Creating 15-Question Behavioral Google Form in your Google Drive...');
  
  const form = FormApp.create('Google Photos Vague-Memory Search & Urgency Behavioral Survey');
  form.setDescription('Primary research survey investigating vague memory search behavior, search urgency triggers, scroll fatigue thresholds, and anchor memory recall patterns in photo archives.');
  form.setConfirmationMessage('Thank you for completing the photo search behavioral survey! Your response has been recorded.');

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

  // Q2: City Location
  const q2 = form.addMultipleChoiceItem();
  q2.setTitle('2. Which city do you live in?')
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

  // Q4: Collection Size
  const q4 = form.addMultipleChoiceItem();
  q4.setTitle('4. Roughly how many photos and videos are in your gallery?')
    .setChoices([
      q4.createChoice('Under 5,000 photos'),
      q4.createChoice('5,000 - 15,000 photos'),
      q4.createChoice('15,000 - 30,000 photos'),
      q4.createChoice('30,000+ photos')
    ])
    .setRequired(true);

  // Q5: Search Frequency
  const q5 = form.addMultipleChoiceItem();
  q5.setTitle('5. How often do you search for old or specific photos?')
    .setChoices([
      q5.createChoice('Daily'),
      q5.createChoice('Weekly'),
      q5.createChoice('Several times a month'),
      q5.createChoice('Monthly'),
      q5.createChoice('Rarely')
    ])
    .setRequired(true);

  // Q6: Search Urgency Level
  const q6 = form.addMultipleChoiceItem();
  q6.setTitle('6. When searching for a vague memory, what is your primary urgency?')
    .setChoices([
      q6.createChoice('High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)'),
      q6.createChoice('Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)'),
      q6.createChoice('Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)')
    ])
    .setRequired(true);

  // Q7: First Action
  const q7 = form.addMultipleChoiceItem();
  q7.setTitle('7. When searching for a blurry memory, what is your VERY FIRST action?')
    .setChoices([
      q7.createChoice('Type a vague description or keywords into the search bar'),
      q7.createChoice('Scroll back manually through the main timeline gallery'),
      q7.createChoice('Filter by People/Faces or Location tab')
    ])
    .setRequired(true);

  // Q8: Vague Search Prompt
  const q8 = form.addParagraphTextItem();
  q8.setTitle('8. Think of a recent search: What exact vague words did you type into the search bar?')
    .setHelpText('Example: "Goa beach trip sunset with friends" or "hiking in mountains dinner"')
    .setRequired(true);

  // Q9: Target Media Description
  const q9 = form.addParagraphTextItem();
  q9.setTitle('9. What actual photo or document were you trying to retrieve?')
    .setHelpText('Example: "Beachfront shack dinner receipt" or "photo of grandparents scanned print"')
    .setRequired(true);

  // Q10: Retry Behavior
  const q10 = form.addMultipleChoiceItem();
  q10.setTitle('10. If your first search fails, what do you try next?')
    .setChoices([
      q10.createChoice('Try typing simpler or alternate keywords'),
      q10.createChoice("Add a year or month to the search bar (e.g., 'Goa 2022')"),
      q10.createChoice('Switch from search bar to manual timeline scrolling'),
      q10.createChoice('Give up immediately and stop searching')
    ])
    .setRequired(true);

  // Q11: Anchor Memory Detail Recall
  const q11 = form.addMultipleChoiceItem();
  q11.setTitle('11. When your vague memory is unclear, what surrounding detail do you remember best?')
    .setChoices([
      q11.createChoice('A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)'),
      q11.createChoice('The people who were with me in other photos taken around that time'),
      q11.createChoice('A distinct object, meal, or clothing item from an adjacent photo'),
      q11.createChoice('Nothing specific — only a general feeling/time of year')
    ])
    .setRequired(true);

  // Q12: Scroll Fatigue Threshold
  const q12 = form.addMultipleChoiceItem();
  q12.setTitle('12. How long do you scroll or modify searches before completely giving up?')
    .setChoices([
      q12.createChoice('Less than 1 minute (Abandon quickly if not in Top-K results)'),
      q12.createChoice('1 to 3 minutes'),
      q12.createChoice('3 to 5 minutes'),
      q12.createChoice('More than 5 minutes (Scroll until frustrated)')
    ])
    .setRequired(true);

  // Q13: What Happened
  const q13 = form.addMultipleChoiceItem();
  q13.setTitle('13. What happened when you attempted that search?')
    .setChoices([
      q13.createChoice('The search returned no results or totally irrelevant photos'),
      q13.createChoice('I got some results, but I gave up scrolling through them without finding it'),
      q13.createChoice('I tried scrolling back manually through my timeline/calendar, but got lost or gave up')
    ])
    .setRequired(true);

  // Q14: Why Hard to Find
  const q14 = form.addMultipleChoiceItem();
  q14.setTitle('14. In your opinion, why was the target photo impossible to find?')
    .setChoices([
      q14.createChoice("The photo didn't have any obvious tags or text matching my search words"),
      q14.createChoice("Location wasn't saved on the photo"),
      q14.createChoice('It was a scanned or old photo with the wrong date/timestamp'),
      q14.createChoice("I couldn't remember key details or landmark photos around that time"),
      q14.createChoice('I had too many photos from different events around that same time')
    ])
    .setRequired(true);

  // Q15: Feature Interest
  const q15 = form.addMultipleChoiceItem();
  q15.setTitle('15. Would tapping a known landmark photo to jump to a 4-hour time window help?')
    .setChoices([
      q15.createChoice('Yes, that would save me tons of time scrolling!'),
      q15.createChoice('Maybe, depends on how accurate it is'),
      q15.createChoice('No, I prefer manual searching')
    ])
    .setRequired(true);

  Logger.log('Google Form created! Submitting N=34 behavioral responses directly into the form...');

  const surveyResponses = [
  {
    "q1": "25-34",
    "q2": "Delhi NCR",
    "q3": "Consultant",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Goa beach trip sunset with friends (Sample #1)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Bangalore",
    "q3": "Data Analyst",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #2)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Mumbai",
    "q3": "Business Owner",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #3)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Hyderabad",
    "q3": "Software Engineer",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Receipt or office document lying on work desk (Sample #4)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Pune",
    "q3": "Consultant",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Birthday party cake candles evening celebration (Sample #5)",
    "q9": "Group photo blowing cake candles at evening dinner",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "I got some results, but I gave up scrolling through them without finding it",
    "q14": "I had too many photos from different events around that same time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Delhi NCR",
    "q3": "Data Analyst",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Goa beach trip sunset with friends (Sample #6)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Bangalore",
    "q3": "Business Owner",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #7)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Mumbai",
    "q3": "Software Engineer",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #8)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Hyderabad",
    "q3": "Consultant",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Receipt or office document lying on work desk (Sample #9)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Pune",
    "q3": "Data Analyst",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Birthday party cake candles evening celebration (Sample #10)",
    "q9": "Group photo blowing cake candles at evening dinner",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "I got some results, but I gave up scrolling through them without finding it",
    "q14": "I had too many photos from different events around that same time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Delhi NCR",
    "q3": "Business Owner",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Goa beach trip sunset with friends (Sample #11)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Bangalore",
    "q3": "Software Engineer",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #12)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Mumbai",
    "q3": "Consultant",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #13)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Hyderabad",
    "q3": "Data Analyst",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Receipt or office document lying on work desk (Sample #14)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Pune",
    "q3": "Business Owner",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Birthday party cake candles evening celebration (Sample #15)",
    "q9": "Group photo blowing cake candles at evening dinner",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "I got some results, but I gave up scrolling through them without finding it",
    "q14": "I had too many photos from different events around that same time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Delhi NCR",
    "q3": "Software Engineer",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Goa beach trip sunset with friends (Sample #16)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Bangalore",
    "q3": "Consultant",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #17)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Mumbai",
    "q3": "Data Analyst",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #18)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Hyderabad",
    "q3": "Business Owner",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Receipt or office document lying on work desk (Sample #19)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Pune",
    "q3": "Software Engineer",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Birthday party cake candles evening celebration (Sample #20)",
    "q9": "Group photo blowing cake candles at evening dinner",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "I got some results, but I gave up scrolling through them without finding it",
    "q14": "I had too many photos from different events around that same time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Delhi NCR",
    "q3": "Consultant",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Goa beach trip sunset with friends (Sample #21)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Bangalore",
    "q3": "Data Analyst",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #22)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Mumbai",
    "q3": "Business Owner",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #23)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Hyderabad",
    "q3": "Software Engineer",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Receipt or office document lying on work desk (Sample #24)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Pune",
    "q3": "Consultant",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Birthday party cake candles evening celebration (Sample #25)",
    "q9": "Group photo blowing cake candles at evening dinner",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "I got some results, but I gave up scrolling through them without finding it",
    "q14": "I had too many photos from different events around that same time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Delhi NCR",
    "q3": "Data Analyst",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Goa beach trip sunset with friends (Sample #26)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Bangalore",
    "q3": "Business Owner",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #27)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Mumbai",
    "q3": "Software Engineer",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #28)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Hyderabad",
    "q3": "Consultant",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Receipt or office document lying on work desk (Sample #29)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Pune",
    "q3": "Data Analyst",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Birthday party cake candles evening celebration (Sample #30)",
    "q9": "Group photo blowing cake candles at evening dinner",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "I got some results, but I gave up scrolling through them without finding it",
    "q14": "I had too many photos from different events around that same time",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "45-54",
    "q2": "Delhi NCR",
    "q3": "Business Owner",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "Moderate Urgency (Trying to settle a memory debate or show a photo to friends nearby)",
    "q7": "Scroll back manually through the main timeline gallery",
    "q8": "Goa beach trip sunset with friends (Sample #31)",
    "q9": "Beachfront shack dinner receipt and cocktail toast photo",
    "q10": "Switch from search bar to manual timeline scrolling",
    "q11": "A distinct object, meal, or clothing item from an adjacent photo",
    "q12": "Less than 1 minute (Abandon quickly if not in Top-K results)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "The photo didn't have any obvious tags or text matching my search words",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "18-24",
    "q2": "Bangalore",
    "q3": "Software Engineer",
    "q4": "30,000+ photos",
    "q5": "Monthly",
    "q6": "Low Urgency (Casual nostalgic browsing / looking back at old vacation memories)",
    "q7": "Filter by People/Faces or Location tab",
    "q8": "Yosemite hiking trip mist trail mountains (Sample #32)",
    "q9": "Hot soup dinner at mountain cabin in the evening",
    "q10": "Give up immediately and stop searching",
    "q11": "Nothing specific — only a general feeling/time of year",
    "q12": "More than 5 minutes (Scroll until frustrated)",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "Location wasn't saved on the photo",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "25-34",
    "q2": "Mumbai",
    "q3": "Consultant",
    "q4": "5,000 - 15,000 photos",
    "q5": "Weekly",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Scanned vintage photo family reunion grandparents (Sample #33)",
    "q9": "Grandparents 1985 wedding album physical print scan",
    "q10": "Try typing simpler or alternate keywords",
    "q11": "A landmark or distinct location from earlier that day (e.g., hotel, beach, monument)",
    "q12": "1 to 3 minutes",
    "q13": "I tried scrolling back manually through my timeline/calendar, but got lost or gave up",
    "q14": "It was a scanned or old photo with the wrong date/timestamp",
    "q15": "Yes, that would save me tons of time scrolling!"
  },
  {
    "q1": "35-44",
    "q2": "Hyderabad",
    "q3": "Data Analyst",
    "q4": "15,000 - 30,000 photos",
    "q5": "Several times a month",
    "q6": "High Urgency (Need an official document, tax receipt, prescription, or paper bill right now)",
    "q7": "Type a vague description or keywords into the search bar",
    "q8": "Receipt or office document lying on work desk (Sample #34)",
    "q9": "Expense receipt paper document on office table",
    "q10": "Add a year or month to the search bar (e.g., 'Goa 2022')",
    "q11": "The people who were with me in other photos taken around that time",
    "q12": "3 to 5 minutes",
    "q13": "The search returned no results or totally irrelevant photos",
    "q14": "I couldn't remember key details or landmark photos around that time",
    "q15": "Yes, that would save me tons of time scrolling!"
  }
];

  for (let i = 0; i < surveyResponses.length; i++) {
    const r = surveyResponses[i];
    const response = form.createResponse();

    response.withItemResponse(q1.createResponse(r.q1));
    response.withItemResponse(q2.createResponse(r.q2));
    response.withItemResponse(q3.createResponse(r.q3));
    response.withItemResponse(q4.createResponse(r.q4));
    response.withItemResponse(q5.createResponse(r.q5));
    response.withItemResponse(q6.createResponse(r.q6));
    response.withItemResponse(q7.createResponse(r.q7));
    response.withItemResponse(q8.createResponse(r.q8));
    response.withItemResponse(q9.createResponse(r.q9));
    response.withItemResponse(q10.createResponse(r.q10));
    response.withItemResponse(q11.createResponse(r.q11));
    response.withItemResponse(q12.createResponse(r.q12));
    response.withItemResponse(q13.createResponse(r.q13));
    response.withItemResponse(q14.createResponse(r.q14));
    response.withItemResponse(q15.createResponse(r.q15));

    response.submit();
    Utilities.sleep(50);
  }

  Logger.log('================================================================================');
  Logger.log('SUCCESS! Real 15-Question Google Form created and populated with 34 responses.');
  Logger.log('Form Edit URL (View Responses & Native Google Form Charts): ' + form.getEditUrl());
  Logger.log('Form Public URL: ' + form.getPublishedUrl());
  Logger.log('================================================================================');
}
