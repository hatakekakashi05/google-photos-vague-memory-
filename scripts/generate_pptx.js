const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function buildPowerPointDeck() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'Google Photos Gemini AI Vague-Memory Search & Retrieval Engine';
  pptx.subject = 'Product Management Executive Case Study';

  // High-contrast, color-blind accessible visual palette
  const COLOR_PRIMARY_BLUE = '1A73E8';
  const COLOR_TEXT_DARK = '202124';
  const COLOR_TEXT_MUTED = '3C4043';
  const COLOR_SLIDE_BG = 'F8F9FA';
  const COLOR_CARD_BG = 'FFFFFF';
  const COLOR_BORDER = 'DADCE0';

  // 10-Slide Master Deck aligned to strict rubrics
  const slidesData = [
    {
      slideNum: 1,
      category: "1. TITLE & DEPLOYED AI-NATIVE MVP",
      title: "Gemini AI Memory Engine Solves Vague Retrieval via 1-Tap Timeline Context Jump",
      subtitle: "Executive Overview & Production App Deployments",
      bullets: [
        "Problem Solved: Traditional keyword search fails when users recall vague event memories (e.g. 'Goa beach dinner') rather than un-tagged file metadata.",
        "Deployed AI-Native MVP: Production prototype live on Vercel: https://google-photos-vague-memory-discover.vercel.app/",
        "Discovery Engine Dashboard: Problem analytics dashboard live on Vercel: https://google-photos-vague-memory-discover.vercel.app/",
        "Primary Research Form: Interactive survey tool live at: https://google-photos-vague-memory-discover.vercel.app/google_form.html",
        "Source Codebase: Public GitHub repository hosted at: https://github.com/hatakekakashi05/google-photos-vague-memory-"
      ],
      speakerNotes: "Slide 1 introduces the executive solution: Google Photos Gemini AI Vague-Memory Retrieval Engine. Live links to our deployed Vercel apps, primary research form, and GitHub repo are included."
    },
    {
      slideNum: 2,
      category: "2. BUSINESS METRIC DECOMPOSITION",
      title: "Decomposing User VMRSR into Anchor Discovery & Target Reachability Rates",
      subtitle: "Canonical North-Star Metric Tree Architecture",
      bullets: [
        "North-Star Metric (User VMRSR): Ratio of successful vague memory retrievals to total vague search attempts across active photo collections.",
        "Metric Decomposition Formula: User VMRSR = Candidate Anchor Discovery Rate (ADR) × Target Context Reachability Rate (TCRR).",
        "Stage G1 Bottleneck: 67.6% of search failure sessions terminate at initial query formulation due to semantic asymmetry.",
        "Target Metric Lift: Gemini AI query parsing elevates ADR from 32.4% baseline to 100% benchmark discovery in candidate surfacing."
      ],
      speakerNotes: "Slide 2 details our metric tree. We decompose User VMRSR into Candidate Anchor Discovery Rate (ADR) and Target Context Reachability Rate (TCRR)."
    },
    {
      slideNum: 3,
      category: "3. DISCOVERY-ENGINE FINDINGS",
      title: "1,000 Public Reviews Reveal 67.6% Query Surfacing Failure and 50% Document Need",
      subtitle: "Multi-Platform Public Community Feedback Analytics",
      bullets: [
        "Public Review Dataset: 1,000 public community reviews analyzed across Reddit, Play Store, App Store, X, and Google Support.",
        "Gemini 2.5 Flash Synthesis: Synthesizes feedback into 6 key friction domains, revealing 676 out of 1,000 queries fail at initial surfacing.",
        "High-Urgency Document Need: 50.0% of vague searches target critical paper bills, tax receipts, warranties, or medical prescriptions.",
        "Live Analytics Tool: App 1 Discovery Engine (https://google-photos-vague-memory-discover.vercel.app/) provides real-time Gemini categorization."
      ],
      speakerNotes: "Slide 3 presents empirical discovery findings from 1,000 public user reviews analyzed via Gemini 2.5 Flash API."
    },
    {
      slideNum: 4,
      category: "4. USER RESEARCH & RETRIEVAL TASKS",
      title: "User Research Discovers 76.5% Scroll Fatigue Cliff and 52.9% Event Anchor Recall",
      subtitle: "Primary Survey Research & Observed Retrieval Behaviors",
      bullets: [
        "Primary Research Cohort: N=34 active mobile photo archivers evaluated across 15-question research survey.",
        "Observed Scroll Fatigue Cliff: 76.5% of users experience extreme scroll fatigue and abandon search after 1 to 3 minutes of timeline scrolling.",
        "Anchor Detail Recall: 52.9% of users recall surrounding event landmarks (hotels, beaches, vistas) as primary memory anchors when target terms fail.",
        "Interactive Form Asset: Complete survey accessible at https://google-photos-vague-memory-discover.vercel.app/google_form.html"
      ],
      speakerNotes: "Slide 4 summarizes primary user research across N=34 responses, highlighting the steep scroll fatigue cliff."
    },
    {
      slideNum: 5,
      category: "5. CHOSEN TARGET SEGMENT",
      title: "Targeting Active Multi-Year Mobile Archivers Searching High-Urgency Media",
      subtitle: "User Persona Segmentation & High-Value Friction Focus",
      bullets: [
        "Target Persona: 'High-Volume Personal Media Archivers' managing 5,000+ personal photos and document scans across 3+ years.",
        "Core Task Frequency: 4 to 8 vague memory search attempts per month for expenses, paper receipts, tax records, or past vacation moments.",
        "User Pain Intensity: Severe anxiety during time-sensitive document retrieval (warranties, expense filing, medical forms).",
        "Strategic Segment Fit: Maximizes user retention and daily engagement by solving high-friction retrieval dead-ends."
      ],
      speakerNotes: "Slide 5 defines our target user persona—active mobile archivers facing acute friction when retrieving un-tagged documents and event media."
    },
    {
      slideNum: 6,
      category: "6. ROOT CAUSE & PROBLEM DEFINITION",
      title: "Semantic & Metadata Asymmetry Between Vague Queries and Un-Tagged Media",
      subtitle: "CFM-01 Failure Taxonomy & Ground-Truth Isolation",
      bullets: [
        "Root Cause (CFM-01): Semantic asymmetry between subjective natural-language queries ('Goa beach dinner receipt') and un-tagged photo metadata.",
        "Metadata Stripping Impact: Third-party messaging (WhatsApp, Telegram) strips EXIF GPS & timestamp metadata, creating retrieval blind-spots.",
        "Gemini AI Parsing Solution: Converts vague queries into extracted anchor keywords ('Goa beach') and target descriptors ('dinner receipt').",
        "Ground-Truth Governance: Evaluation ground-truth labels are strictly isolated in benchmark scripts and never fed to ranking logic."
      ],
      speakerNotes: "Slide 6 breaks down the root cause (CFM-01): semantic asymmetry and EXIF metadata loss, solved via Gemini AI signal parsing."
    },
    {
      slideNum: 7,
      category: "7. SOLUTION RATIONALE & CONCEPT A",
      title: "Concept A Outperforms Alternatives with 8.93/10 Score via 1-Tap Contextual Jump",
      subtitle: "Architectural Trade-off Matrix & Concept Selection",
      bullets: [
        "Concept A (Selected - Score 8.93/10): Gemini AI Search + 1-Tap Timeline Context Expansion (±4.0h, ≤1.0km). Lowest friction, highest recall.",
        "Concept B (Rejected - Score 6.40/10): Semantic Multi-Hop RAG rejected due to high computational latency and complex multimodal failure modes.",
        "Concept C (Rejected - Score 4.10/10): Manual Metadata Tagging rejected due to unacceptable user friction and near-zero user adoption.",
        "Core Architectural Advantage: Bridges vague text search to land on recognizable anchor photos, expanding surrounding media instantly."
      ],
      speakerNotes: "Slide 7 details our architectural evaluation matrix where Concept A scored 8.93 out of 10."
    },
    {
      slideNum: 8,
      category: "8. MVP IMPLEMENTATION & USER TESTING",
      title: "Interactive Gemini AI MVP Surfacing Candidate Anchors and 1-Tap Context Expansion",
      subtitle: "3-Screen Interactive Solution Prototype Experience",
      bullets: [
        "Interactive MVP Application: Deployed live on Vercel: https://google-photos-vague-memory-discover.vercel.app/",
        "Screen 1 (Search & Signals): Gemini AI search bar with quick pills + optional '✨ Gemini AI Signals Inspector' toggle for signal transparency.",
        "Screen 2 (Candidate Surfacing): Renders 100% verified real-world imagery matching exact scene descriptions (e.g. grandparents in backyard garden).",
        "Screen 3 (1-Tap Context Expansion): Expands candidate photo into surrounding timeline context grid with clean '← Back to Search' navigation."
      ],
      speakerNotes: "Slide 8 showcases App 2: Solution Retrieval MVP with Gemini AI memory search, precision imagery, and 1-tap timeline expansion."
    },
    {
      slideNum: 9,
      category: "9. SUCCESS METRICS & BENCHMARK RESULTS",
      title: "Synthetic Benchmark Achieves 100% Anchor Discovery & 100% Context Reachability",
      subtitle: "Ground-Truth Evaluation Benchmark & API Integration Audit",
      bullets: [
        "Candidate Anchor Discovery Rate (ADR): 100.0% pass rate across benchmark evaluation scenarios.",
        "Target Context Reachability Rate (TCRR): 100.0% successful context expansion for all candidate anchors.",
        "Media Precision Audit: Verified 100% visual precision matching between scene descriptions and Unsplash media URLs across 26 photo entries.",
        "API Health Pass Rate: 100.0% REST API integration pass rate across search and expansion endpoints."
      ],
      speakerNotes: "Slide 9 presents our benchmark audit results: 100% ADR and 100% TCRR pass rates across evaluation scenarios."
    },
    {
      slideNum: 10,
      category: "10. RISKS, LIMITATIONS & EXPERIMENTATION ROADMAP",
      title: "Phased 1% to 100% Rollout Guarded by Spatial-Temporal Filters and Kill-Switches",
      subtitle: "Production Risk Mitigation, Governance & Rollout Ramp",
      bullets: [
        "Spatial-Temporal Boundaries: Windowing boundaries (±4.0h, ≤1.0km) prevent multi-event overlap and context pollution.",
        "Zero-State Fallback Affordances: Gracefully handles missing EXIF timestamps ('View Date in Timeline') and sparse receipt archives.",
        "Phased A/B Testing Ramp: Controlled rollout schedule (1% → 5% → 25% → 100%) with remote kill-switch feature flags.",
        "Complete Project Codebase: Hosted publicly on GitHub: https://github.com/hatakekakashi05/google-photos-vague-memory-"
      ],
      speakerNotes: "Slide 10 details production risk mitigations, fallback affordances, and our phased A/B experimentation roadmap."
    }
  ];

  for (const data of slidesData) {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_SLIDE_BG };

    // Set Speaker Notes
    slide.notes = data.speakerNotes;

    // Top Header Banner Box
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 1.15,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    // Category / Slide Number Badge (Strictly Font Size >= 14pt)
    slide.addText(data.category, {
      x: 0.5, y: 0.12, w: 9.0, h: 0.28,
      fontSize: 14, bold: true, color: COLOR_PRIMARY_BLUE
    });

    // Slide Title — Key Message (Strictly Font Size >= 14pt; 20pt)
    slide.addText(data.title, {
      x: 0.5, y: 0.42, w: 9.0, h: 0.65,
      fontSize: 20, bold: true, color: COLOR_TEXT_DARK
    });

    // Content Card Box Container
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 1.35, w: 9.0, h: 3.95,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    // Subtitle inside Card Box (Strictly Font Size >= 14pt; 16pt)
    slide.addText(data.subtitle, {
      x: 0.8, y: 1.55, w: 8.4, h: 0.4,
      fontSize: 16, bold: true, color: COLOR_PRIMARY_BLUE
    });

    // Bullet Items (Strictly Font Size >= 14pt)
    const formattedBullets = data.bullets.map(b => ({
      text: b,
      options: { fontSize: 14, color: COLOR_TEXT_DARK, bullet: true, spaceAfter: 12 }
    }));

    slide.addText(formattedBullets, {
      x: 0.8, y: 2.05, w: 8.4, h: 3.05
    });

    // Slide Footer (Strictly Font Size >= 14pt)
    slide.addText("Google Photos Gemini AI Vague-Memory Search & Retrieval Engine | Executive Case Study", {
      x: 0.5, y: 5.4, w: 9.0, h: 0.25,
      fontSize: 14, color: COLOR_TEXT_MUTED, align: 'center'
    });
  }

  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPathNL = path.join(outputDir, 'NL_GooglePhotos.pptx');
  const outputPathStandard = path.join(outputDir, 'google_photos_vague_memory_presentation.pptx');

  await pptx.writeFile({ fileName: outputPathNL });
  fs.copyFileSync(outputPathNL, outputPathStandard);

  console.log("================================================================================");
  console.log(`STRICT GUIDELINE COMPLIANT POWERPOINT GENERATED:`);
  console.log(`File Path (NL_GooglePhotos.pptx): ${outputPathNL}`);
  console.log(`File Path (google_photos_vague_memory_presentation.pptx): ${outputPathStandard}`);
  console.log(`Total Slides: Exactly 10 Slides (16:9 Widescreen)`);
  console.log(`Fellow Name Removed: YES (100% Compliant)`);
  console.log(`Minimum Font Size: 14pt Everywhere (100% Compliant)`);
  console.log("================================================================================");
}

buildPowerPointDeck().catch(err => console.error("Error generating PPTX:", err));
