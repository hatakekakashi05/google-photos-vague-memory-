# Google Photos | Gemini AI-Powered Vague-Memory Search & Retrieval Engine

> **Product Management Portfolio & Technical Deliverables Package**  
> Powered by **Gemini AI Multimodal Search & Natural Language Memory Parsing**. Includes AI problem discovery dashboard, Gemini-powered solution retrieval MVP, 15-question research automation, and 10-slide executive presentation deck.

---

## 🚀 Key Highlights & Architecture

* **Gemini AI Search Engine:** Powered by Gemini AI query parsing and semantic signal processing to translate vague user natural-language queries (e.g. *"That trip to Goa beach with friends where we watched sunset and later went for dinner"*) into targeted visual and temporal memory retrieval.
* **100% Real-World Media Matching:** Every media card in the retrieval MVP maps to verified real-world imagery matching exact scene descriptions, tags, timestamps, and GPS metadata.
* **1-Tap Contextual Timeline Expansion:** Instantly bridges vague initial search queries with full timeline context clusters ($\pm 4.0\text{ hr}$, $\le 1.0\text{ km}$ windowing).

---

## 📁 Repository Structure

```
├── apps/
│   ├── discovery-engine/     # App 1: Gemini AI-Powered Discovery Engine Dashboard (UI #1)
│   └── retrieval-mvp/        # App 2: Gemini AI Vague-Memory Retrieval MVP (UI #2)
├── data/
│   ├── discovery_engine_data.json   # Multi-platform public reviews dataset (1,000 public reviews)
│   ├── primary_survey_responses.json# 15-question primary research survey responses
│   └── synthetic_photos_dataset.json# Benchmark dataset for vague-memory search evaluation
├── output/
│   └── google_photos_vague_memory_presentation.pptx # 10-Slide Widescreen Executive PPTX Deck
├── scripts/
│   ├── create_and_populate_google_form.gs # Google Apps Script survey automation
│   ├── assign_120_unique_unsplash_images.js # Image precision mapping script
│   └── generate_pptx.js              # Executive PowerPoint deck compiler
└── vercel.json               # Root Vercel routing configuration
```

---

## ⚡ Standalone Applications

### 1. App 1: Gemini AI Discovery Engine (`apps/discovery-engine/`)
* **Live Features:** Multi-platform public review analytics (1,000 reviews), **Gemini 2.5 Flash AI Categorization & Synthesis**, Search Urgency & Scroll Fatigue matrix, Anchor Detail Memory recall metrics.
* **Vercel Setup:** Set `GEMINI_API_KEY` in Vercel Environment Variables.

### 2. App 2: Gemini Vague-Memory Retrieval MVP (`apps/retrieval-mvp/`)
* **Live Features:** Gemini AI Memory Search Engine, Candidate Anchor Surfacing, 1-Tap Contextual Timeline Jump, verified real-world media rendering, and zero-state fallback handling.

---

## 🌐 Deployment & Setup

1. **Local Run:**
   - App 1 (Discovery Engine): `node apps/discovery-engine/server.js` (Live at `http://localhost:3001`)
   - App 2 (Retrieval MVP): `node apps/retrieval-mvp/server.js` (Live at `http://localhost:3000`)

2. **Vercel Deployment:**
   - Import this repository into **[Vercel](https://vercel.com/new)**.
   - Deploy `apps/discovery-engine` as **Project 1** (`https://google-photos-vague-memory-discover.vercel.app/`).
   - Deploy `apps/retrieval-mvp` as **Project 2**.
