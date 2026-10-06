const fs = require('fs');

/**
 * AI-Native MVP Query Signal Parser (Phase P3 Component).
 * 
 * Responsible for parsing vague, multi-concept natural language query prompts
 * into structured JSON query signals.
 * 
 * Strict Governance & Scope Compliance:
 * - Operates locally without requiring external Google-internal APIs or third-party paid keys.
 * - Extracts structured anchor keywords, target descriptors, temporal hints, and spatial hints.
 * - Classifies search intent (e.g., ANCHOR_DISCOVERY, ANCHOR_TO_TARGET_EXPANSION, DIRECT_TARGET_SEARCH).
 * - Feeds normalized signals directly into the P2 Retrieval Engine.
 */
class AIQueryParser {
  constructor() {
    // Pure grammatical stop words set for signal extraction
    this.stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while',
      'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
      'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'upon', 'down',
      'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
      'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
      'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
      'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just',
      'don', 'should', 'now', 'that', 'we', 'was', 'were', 'is', 'are', 'be', 'been',
      'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing'
    ]);

    // Spatial gazetteer / location dictionary for heuristic extraction
    this.knownLocations = ['goa', 'yosemite', 'delhi', 'gurgaon', 'office', 'beach', 'mountains', 'trail'];
    
    // Temporal keywords dictionary
    this.temporalKeywords = {
      'sunset': 'EVENING',
      'evening': 'EVENING',
      'morning': 'MORNING',
      'night': 'NIGHT',
      'dinner': 'EVENING',
      'breakfast': 'MORNING',
      'lunch': 'AFTERNOON',
      'vintage': 'HISTORICAL_NO_EXIF',
      'scanned': 'HISTORICAL_NO_EXIF'
    };

    // Target descriptor keywords that represent non-anchor secondary target photos / documents
    this.targetKeywords = ['dinner', 'soup', 'receipt', 'document', 'desk', 'office', 'work', 'candles', 'cake', 'party'];
  }

  /**
   * Tokenize natural language text into clean lowercase tokens.
   */
  tokenize(text) {
    if (!text) return [];
    const tokens = text.toLowerCase().match(/\w+/g) || [];
    return tokens.filter(t => t.length > 1);
  }

  /**
   * Filter stop words from token array.
   */
  filterStopWords(tokens) {
    return tokens.filter(t => !this.stopWords.has(t));
  }

  /**
   * Parses a vague natural language query into a structured JSON query signal.
   * 
   * @param {string} rawQuery - Vague natural language query string from user
   * @returns {Object} Structured Query Signal object
   */
  parseQuery(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') {
      return this.emptySignal(rawQuery);
    }

    const allTokens = this.tokenize(rawQuery);
    const semanticTokens = this.filterStopWords(allTokens);
    const normalizedQuery = semanticTokens.join(' ');

    // 1. Extract Spatial Hints
    const spatialHints = {
      location_names: [],
      spatial_radius_km: 1.0 // Canonical prototype spatial window parameter (Phase 6/7/P1/P2)
    };
    for (const token of allTokens) {
      if (this.knownLocations.includes(token) && !spatialHints.location_names.includes(token)) {
        spatialHints.location_names.push(token);
      }
    }

    // 2. Extract Temporal Hints
    const temporalHints = {
      time_of_day: null,
      is_historical_scanned: false,
      temporal_window_hours: 4.0 // Canonical prototype temporal expansion parameter (Phase 6/7/P1/P2)
    };
    for (const token of allTokens) {
      if (this.temporalKeywords[token]) {
        const val = this.temporalKeywords[token];
        if (val === 'HISTORICAL_NO_EXIF') {
          temporalHints.is_historical_scanned = true;
        } else {
          temporalHints.time_of_day = val;
        }
      }
    }

    // 3. Extract Target Descriptors vs Anchor Keywords
    const targetDescriptors = [];
    const anchorKeywords = [];

    for (const token of semanticTokens) {
      if (this.targetKeywords.includes(token)) {
        if (!targetDescriptors.includes(token)) targetDescriptors.push(token);
      } else {
        if (!anchorKeywords.includes(token)) anchorKeywords.push(token);
      }
    }

    // 4. Intent Classification Logic
    let searchIntent = 'ANCHOR_DISCOVERY';
    if (temporalHints.is_historical_scanned) {
      searchIntent = 'EDGE_CASE_MISSING_EXIF_DISCOVERY';
    } else if (targetDescriptors.includes('receipt') || targetDescriptors.includes('document') || (anchorKeywords.length === 0 && targetDescriptors.length > 0)) {
      searchIntent = 'DIRECT_TARGET_SEARCH';
      // For direct target search, do not manufacture anchor keywords
      anchorKeywords.length = 0;
    } else if (targetDescriptors.length > 0 && anchorKeywords.length > 0) {
      searchIntent = 'ANCHOR_TO_TARGET_EXPANSION';
    }

    // 5. Query String Construction for Retrieval Engine
    const retrievalQueryString = anchorKeywords.length > 0 ? anchorKeywords.join(' ') : semanticTokens.join(' ');

    // 6. Confidence Score Calculation
    let confidence = 0.5;
    if (semanticTokens.length >= 2) confidence += 0.2;
    if (spatialHints.location_names.length > 0) confidence += 0.15;
    if (temporalHints.time_of_day || temporalHints.is_historical_scanned) confidence += 0.15;
    confidence = Math.min(1.0, Math.round(confidence * 100) / 100);

    return {
      raw_query: rawQuery,
      normalized_query: normalizedQuery,
      search_intent: searchIntent,
      extracted_signals: {
        anchor_keywords: anchorKeywords,
        target_descriptors: targetDescriptors,
        temporal_hints: temporalHints,
        spatial_hints: spatialHints
      },
      retrieval_query_string: retrievalQueryString,
      parser_metadata: {
        confidence_score: confidence,
        signal_count: semanticTokens.length,
        strategy: 'PATTERN_NLP_RULES'
      }
    };
  }

  emptySignal(rawQuery) {
    return {
      raw_query: rawQuery || '',
      normalized_query: '',
      search_intent: 'UNKNOWN',
      extracted_signals: {
        anchor_keywords: [],
        target_descriptors: [],
        temporal_hints: { time_of_day: null, is_historical_scanned: false, temporal_window_hours: 4.0 },
        spatial_hints: { location_names: [], spatial_radius_km: 1.0 }
      },
      retrieval_query_string: '',
      parser_metadata: {
        confidence_score: 0.0,
        signal_count: 0,
        strategy: 'PATTERN_NLP_RULES'
      }
    };
  }
}

module.exports = AIQueryParser;
