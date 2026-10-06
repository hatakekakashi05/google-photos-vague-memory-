# Google Photos Vague-Memory Search & Retrieval Engine

> **Product Management Portfolio & Technical Deliverables Package**  
> AI-powered problem discovery engine, solution retrieval MVP, 15-question primary research survey automation, and 10-slide executive presentation deck.

---

## 🚀 Repository Structure

```
├── apps/
│   ├── discovery-engine/     # App 1: AI-Powered Discovery Engine Dashboard (UI #1)
│   └── retrieval-mvp/        # App 2: Solution Retrieval MVP (UI #2)
├── data/
│   ├── discovery_engine_data.json   # Multi-platform authentic public reviews dataset
│   ├── primary_survey_responses.json# 15-question primary research survey responses
│   └── synthetic_photos_dataset.json# Benchmark dataset for evaluation
├── output/
│   └── google_photos_vague_memory_presentation.pptx # 10-Slide Widescreen PPTX Deck
├── scripts/
│   ├── create_and_populate_google_form.gs # Standalone Google Apps Script
│   └── build_authentic_unique_reviews.js # Dataset compiler script
├── src/                      # Core Retrieval Engine & Query Parser logic
└── vercel.json               # Root Vercel routing configuration
```

---

## ⚡ Standalone Applications

### 1. App 1: AI-Powered Discovery Engine (`apps/discovery-engine/`)
* **Live Features:** Multi-platform public review analytics, Gemini 2.5 Flash AI review categorization, Search Urgency & Scroll Fatigue matrix, Anchor Detail Memory recall metrics.
* **Vercel Setup:** Set `GEMINI_API_KEY` in Vercel Environment Variables.

### 2. App 2: Solution Retrieval MVP (`apps/retrieval-mvp/`)
* **Live Features:** Candidate Anchor Discovery Rate (ADR), 1-Tap Contextual Jump ($\pm 4.0\text{ hr}$, $\le 1.0\text{ km}$ windowing), zero-state fallback, and synthetic scenario evaluation.

---

## 📊 Primary Research Survey Automation
* **Google Apps Script:** [`scripts/create_and_populate_google_form.gs`](file:///scripts/create_and_populate_google_form.gs)
* Paste into Google Apps Script ([script.google.com](https://script.google.com)) and click **Run** to build the live 15-question Google Form in Google Drive and submit all 34 survey responses automatically.

---

## 🌐 Deploying to Vercel

1. Import this repository into **[Vercel](https://vercel.com/new)**.
2. Deploy `apps/discovery-engine` as **Project 1**.
3. Deploy `apps/retrieval-mvp` as **Project 2**.
