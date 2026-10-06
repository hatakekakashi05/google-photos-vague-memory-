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
  const COLOR_HEADER_BG = 'E8F0FE';

  const slidesData = [
    // SLIDE 1
    {
      slideNum: 1,
      category: "1. TITLE & DEPLOYED AI-NATIVE MVP",
      title: "Gemini AI Memory Engine Solves Vague Retrieval via 1-Tap Timeline Context Jump",
      subtitle: "Executive Overview & Production App Deployments",
      tableHeader: ["System Component", "Role & PM Capability", "Deployed URL / Resource Link", "Status"],
      tableColW: [2.2, 3.3, 3.3, 1.2],
      tableRows: [
        ["App 2: Solution MVP", "Gemini AI Search & 1-Tap Timeline Context Jump", "https://google-photos-vague-memory-discover.vercel.app/", "LIVE (Vercel)"],
        ["App 1: Discovery Engine", "Public Review Analytics & Gemini 2.5 Flash API", "https://google-photos-vague-memory-discover.vercel.app/", "LIVE (Vercel)"],
        ["Primary Research Form", "15-Question User Research Automation Tool", "https://google-photos-vague-memory-discover.vercel.app/google_form.html", "LIVE"],
        ["GitHub Repository", "Public Codebase, Datasets & Integration Tests", "https://github.com/hatakekakashi05/google-photos-vague-memory-", "PUBLIC"]
      ],
      speakerNotes: "Slide 1 provides executive summary and hyperlinked deployed Vercel apps, research forms, and GitHub repo."
    },
    // SLIDE 2
    {
      slideNum: 2,
      category: "2. BUSINESS METRIC DECOMPOSITION",
      title: "Decomposing User VMRSR into Anchor Discovery & Target Reachability Rates",
      subtitle: "Canonical North-Star Metric Tree Architecture",
      tableHeader: ["Metric Layer", "Metric Name", "Baseline / Target", "Mathematical Definition / Formula", "Strategic Lift"],
      tableColW: [1.8, 2.2, 2.0, 2.8, 1.2],
      tableRows: [
        ["North-Star Metric", "User VMRSR", "32.4% → 85.0%+", "Unique Users with ≥1 Retrieval Success / Total Vague Search Users", "Primary Impact"],
        ["Sub-Metric 1", "Anchor Discovery Rate (ADR)", "32.4% → 100.0%", "Surfaced Candidate Anchors / Total Vague Query Sessions", "Stage G1 Lift"],
        ["Sub-Metric 2", "Target Reachability Rate (TCRR)", "23.5% → 100.0%", "Target Media Found in Context / Surfaced Anchor Sessions", "Stage G2/G3 Lift"],
        ["Guardrail Metric", "Scroll Fatigue Abandonment", "76.5% → < 15.0%", "Search Sessions Abandoned between 1 to 3 minutes of timeline scrolling", "Friction Reducer"]
      ],
      speakerNotes: "Slide 2 decomposes north-star User VMRSR into Anchor Discovery Rate and Target Reachability Rate."
    },
    // SLIDE 3
    {
      slideNum: 3,
      category: "3. DISCOVERY-ENGINE FINDINGS",
      title: "1,000 Public Reviews Reveal 67.6% Query Surfacing Failure and 50% Document Need",
      subtitle: "Multi-Platform Public Community Feedback Analytics",
      tableHeader: ["Friction Domain Category", "Complaints Count", "Share (%)", "Observed User Impact", "Gemini AI Synthesis"],
      tableColW: [2.4, 1.5, 1.2, 2.7, 2.2],
      tableRows: [
        ["Stage G1 Surfacing Failure", "676 / 1,000", "67.6%", "Zero relevant candidates surfaced for un-tagged media", "Semantic & metadata asymmetry"],
        ["High-Urgency Document Need", "500 / 1,000", "50.0%", "Paper bills, tax receipts, warranties lost in archive", "High search anxiety & drop-off cliff"],
        ["EXIF / Timestamp Loss", "245 / 1,000", "24.5%", "Scanned retro prints & WhatsApp downloads un-indexed", "Missing temporal & GPS metadata"],
        ["Scroll Fatigue Cliff", "206 / 1,000", "20.6%", "Timeline search abandonment after 1 to 3 minutes", "Linear timeline search degradation"]
      ],
      speakerNotes: "Slide 3 outlines empirical findings from 1,000 public community reviews analyzed via Gemini 2.5 Flash API."
    },
    // SLIDE 4
    {
      slideNum: 4,
      category: "4. USER RESEARCH & RETRIEVAL TASKS",
      title: "User Research Discovers 76.5% Scroll Fatigue Cliff and 52.9% Event Anchor Recall",
      subtitle: "Primary Survey Research & Observed Retrieval Behaviors (N=34 Cohort)",
      tableHeader: ["Research Dimension", "Empirical Finding", "Cohort Metric (%)", "Observed User Retrieval Behavior"],
      tableColW: [2.2, 2.5, 1.8, 3.5],
      tableRows: [
        ["Scroll Fatigue Threshold", "Abandonment after 1–3 mins", "76.5% (26 / 34 users)", "Users experience extreme fatigue scrolling endless multi-year grids"],
        ["Memory Anchor Detail", "Recalls event landmark", "52.9% (18 / 34 users)", "Users remember hotel/beach location rather than target receipt"],
        ["Vague Search Frequency", "4 to 8 attempts / month", "70.6% (24 / 34 users)", "Regular search friction for paper expenses & vacation moments"],
        ["Document Retrieval Need", "High financial/legal urgency", "58.8% (20 / 34 users)", "Time-sensitive tax, warranty, and expense reimbursement filings"]
      ],
      speakerNotes: "Slide 4 summarizes primary research findings across N=34 responses, highlighting the steep scroll fatigue cliff."
    },
    // SLIDE 5
    {
      slideNum: 5,
      category: "5. CHOSEN TARGET SEGMENT",
      title: "Targeting Active Multi-Year Mobile Archivers Searching High-Urgency Media",
      subtitle: "User Persona Segmentation & High-Value Friction Focus",
      tableHeader: ["Persona Attribute", "High-Volume Personal Archivers (CHOSEN TARGET)", "Casual Snapshot Users (Excluded)"],
      tableColW: [2.5, 4.2, 3.3],
      tableRows: [
        ["Archive Portfolio Size", "5,000+ personal photos & document scans across 3+ years", "< 1,000 recent photos"],
        ["Monthly Vague Queries", "4 to 8 vague memory search attempts per month", "< 1 search attempt per month"],
        ["Target Media Types", "Expense receipts, paper bills, tax scans, vacation moments", "Recent selfies & casual pet photos"],
        ["Pain Point Intensity", "Severe anxiety & time loss during time-sensitive document retrieval", "Low urgency / casual entertainment"],
        ["Strategic Segment Fit", "CHOSEN TARGET SEGMENT — Highest retention & engagement lift", "Low engagement opportunity"]
      ],
      speakerNotes: "Slide 5 contrasts our target persona—active mobile archivers—against casual snapshot users."
    },
    // SLIDE 6
    {
      slideNum: 6,
      category: "6. ROOT CAUSE & PROBLEM DEFINITION",
      title: "Semantic & Metadata Asymmetry Between Vague Queries and Un-Tagged Media",
      subtitle: "CFM-01 Failure Taxonomy & Ground-Truth Isolation",
      tableHeader: ["Failure ID", "Root Cause Component", "Trigger Mechanism", "Technical Impact", "Gemini AI Mitigation"],
      tableColW: [1.2, 2.2, 2.3, 2.3, 2.0],
      tableRows: [
        ["CFM-01.A", "Semantic Asymmetry", "Subjective memory terms mismatch photo tags", "Zero candidate surfacing", "Gemini AI signal parser"],
        ["CFM-01.B", "EXIF Metadata Stripping", "Third-party apps (WhatsApp) strip GPS/time", "Un-indexed blind-spots", "Landmark cluster anchor jump"],
        ["CFM-01.C", "Timeline Scroll Fatigue", "Linear scrolling past 5,000+ media cards", "76.5% search abandonment", "1-Tap contextual jump"],
        ["Governance", "Ground-Truth Isolation", "Benchmark evaluation label confinement", "Zero evaluation leakage", "Post-hoc benchmark script"]
      ],
      speakerNotes: "Slide 6 breaks down root cause CFM-01: semantic asymmetry and EXIF metadata stripping."
    },
    // SLIDE 7
    {
      slideNum: 7,
      category: "7. SOLUTION RATIONALE & CONCEPT A",
      title: "Concept A Outperforms Alternatives with 8.93/10 Score via 1-Tap Contextual Jump",
      subtitle: "Architectural Trade-off Evaluation Matrix",
      tableHeader: ["Concept Option", "User Value (/10)", "Feasibility (/10)", "Latency Impact", "Friction Level", "Total Score", "Decision"],
      tableColW: [2.5, 1.2, 1.2, 1.3, 1.3, 1.0, 1.5],
      tableRows: [
        ["Concept A: Contextual Jump & Expand", "9.2 / 10", "8.8 / 10", "< 100 ms", "Zero Friction", "8.93 / 10", "SELECTED (Recommended)"],
        ["Concept B: Semantic Multi-Hop RAG", "7.0 / 10", "5.8 / 10", "1.8 – 3.2 sec", "High Latency", "6.40 / 10", "REJECTED (High Latency/Cost)"],
        ["Concept C: Manual Tagging Prompts", "4.5 / 10", "3.8 / 10", "0 ms", "Extreme Effort", "4.10 / 10", "REJECTED (Low Adoption)"]
      ],
      speakerNotes: "Slide 7 details our architectural evaluation matrix where Concept A scored 8.93 out of 10."
    },
    // SLIDE 8
    {
      slideNum: 8,
      category: "8. MVP IMPLEMENTATION & USER TESTING",
      title: "Interactive Gemini AI MVP Surfacing Candidate Anchors and 1-Tap Context Expansion",
      subtitle: "3-Screen Interactive Solution Prototype Specification",
      tableHeader: ["UX Screen / Step", "Feature Component", "User Interaction", "Input Signal Parsed", "Rendered Output"],
      tableColW: [1.8, 2.0, 2.0, 2.0, 2.2],
      tableRows: [
        ["Screen 1: Search", "Gemini AI Search Bar", "Types vague query or clicks pill", "Natural language text phrase", "Parses intent & extracts tags"],
        ["Screen 1 Inspector", "✨ Gemini AI Signals Drawer", "Toggles AI inspector button", "Confidence & keyword arrays", "Displays AI signal breakdown"],
        ["Screen 2: Candidates", "Candidate Surfacing Grid", "Views top candidate anchors", "Similarity score ranking", "Renders precision media cards"],
        ["Screen 3: Context Jump", "1-Tap Timeline Context Grid", "Clicks 'Jump to Context' button", "Anchor ID + spatial/temporal window", "Expands 4-5 surrounding photos"]
      ],
      speakerNotes: "Slide 8 details App 2: Solution Retrieval MVP user screens, interactions, and rendered outputs."
    },
    // SLIDE 9
    {
      slideNum: 9,
      category: "9. SUCCESS METRICS & BENCHMARK RESULTS",
      title: "Synthetic Benchmark Achieves 100% Anchor Discovery & 100% Context Reachability",
      subtitle: "Ground-Truth Evaluation Benchmark & API Audit Results",
      tableHeader: ["Evaluation Scenario ID", "Vague Test Query Prompt", "Surfaced Anchor Photo", "Expanded Context Photos", "ADR Pass", "TCRR Pass"],
      tableColW: [2.0, 2.5, 1.8, 2.1, 0.8, 0.8],
      tableRows: [
        ["SCENARIO 1: Goa Beach Trip", "'Goa beach trip sunset with friends'", "GOA_001 (Hotel Lobby)", "5 Surrounding Beach & Shack Photos", "100%", "100%"],
        ["SCENARIO 2: Yosemite Hike", "'Yosemite hike near mist trail soup'", "HIKE_001 (Trailhead)", "4 Mountain & Lodge Soup Photos", "100%", "100%"],
        ["SCENARIO 3: Vintage Reunion", "'Vintage photo of family reunion'", "VIN_001 (Family Lawn)", "4 Scanned 1980s Family Photos", "100%", "100%"],
        ["SCENARIO 4: Office Receipt", "'Receipt lying on work desk'", "REC_001 (Desk Receipt)", "4 Office & Cafe Meeting Photos", "100%", "100%"],
        ["SCENARIO 5: Birthday Party", "'Birthday party cake candles evening'", "BDAY_001 (Cake Candles)", "4 Balloons & Toasting Photos", "100%", "100%"]
      ],
      speakerNotes: "Slide 9 presents synthetic benchmark audit results: 100% ADR and 100% TCRR pass rates across scenarios."
    },
    // SLIDE 10
    {
      slideNum: 10,
      category: "10. RISKS, LIMITATIONS & EXPERIMENTATION ROADMAP",
      title: "Phased 1% to 100% Rollout Guarded by Spatial-Temporal Filters and Kill-Switches",
      subtitle: "Production Risk Mitigation, Governance & Rollout Ramp",
      tableHeader: ["Rollout Phase", "Traffic Ramp (%)", "Target Metric Threshold", "Guardrail Monitoring", "Automated Rollback Trigger"],
      tableColW: [1.8, 1.5, 2.1, 2.1, 2.5],
      tableRows: [
        ["Phase 1: Internal Canary", "1.0% Alpha", "ADR ≥ 90%, API Latency < 150ms", "False Anchor Surface Rate < 5%", "API Error Rate > 1.0%"],
        ["Phase 2: Regional Beta", "5.0% Beta", "User VMRSR Lift ≥ 25%", "Scroll Fatigue Drop-off < 20%", "Negative Feedback > 2.0%"],
        ["Phase 3: Scale Ramp", "25.0% Global", "User VMRSR Lift ≥ 40%", "Spatial Boundary Overlap < 3%", "API Latency > 250ms"],
        ["Phase 4: General Launch", "100.0% Launch", "User VMRSR Lift ≥ 50%", "Continuous Feedback Loop", "Automated Remote Kill-Switch"]
      ],
      speakerNotes: "Slide 10 outlines production risk mitigations, fallback affordances, and our phased A/B experimentation roadmap."
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

    // Category / Slide Number Badge (Font Size >= 14pt; 14pt)
    slide.addText(data.category, {
      x: 0.5, y: 0.12, w: 9.0, h: 0.28,
      fontSize: 14, bold: true, color: COLOR_PRIMARY_BLUE
    });

    // Slide Title — Key Message (Font Size >= 14pt; 20pt)
    slide.addText(data.title, {
      x: 0.5, y: 0.42, w: 9.0, h: 0.65,
      fontSize: 20, bold: true, color: COLOR_TEXT_DARK
    });

    // Subtitle Line above Table (Font Size >= 14pt; 15pt)
    slide.addText(data.subtitle, {
      x: 0.5, y: 1.25, w: 9.0, h: 0.35,
      fontSize: 15, bold: true, color: COLOR_PRIMARY_BLUE
    });

    // Structure Table Rows (Header Row + Body Rows)
    const tableRowsData = [];
    
    // Header Row Formatting
    const headerRow = data.tableHeader.map(headerText => ({
      text: headerText,
      options: {
        fontSize: 14,
        bold: true,
        color: COLOR_PRIMARY_BLUE,
        fill: COLOR_HEADER_BG,
        align: 'left',
        valign: 'middle'
      }
    }));
    tableRowsData.push(headerRow);

    // Body Rows Formatting (Strictly Font Size >= 14pt)
    data.tableRows.forEach(rowCells => {
      const formattedRow = rowCells.map(cellText => ({
        text: cellText,
        options: {
          fontSize: 14,
          color: COLOR_TEXT_DARK,
          fill: COLOR_CARD_BG,
          align: 'left',
          valign: 'middle'
        }
      }));
      tableRowsData.push(formattedRow);
    });

    // Add Executive Data Table to Slide
    slide.addTable(tableRowsData, {
      x: 0.5,
      y: 1.65,
      w: 9.0,
      colW: data.tableColW,
      border: { pt: 1, color: COLOR_BORDER },
      autoPage: false
    });

    // Slide Footer (Font Size >= 14pt)
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
  console.log(`DATA TABLE DRIVEN POWERPOINT PRESENTATION GENERATED SUCCESSFULLY:`);
  console.log(`File Path (NL_GooglePhotos.pptx): ${outputPathNL}`);
  console.log(`File Path (google_photos_vague_memory_presentation.pptx): ${outputPathStandard}`);
  console.log(`Total Slides: Exactly 10 Slides with Structured Data Tables (16:9 Widescreen)`);
  console.log(`Fellow Name Removed: YES (100% Compliant)`);
  console.log(`Minimum Font Size: 14pt Everywhere (100% Compliant)`);
  console.log("================================================================================");
}

buildPowerPointDeck().catch(err => console.error("Error generating PPTX:", err));
