document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stageBreakdownList = document.getElementById('stage-breakdown-list');
  const metricTreeContainer = document.getElementById('metric-tree-container');
  const urgencyDistributionContainer = document.getElementById('urgency-distribution-container');
  const scrollFatigueContainer = document.getElementById('scroll-fatigue-container');
  const anchorRecallContainer = document.getElementById('anchor-recall-container');
  const categorizedReviewsContainer = document.getElementById('categorized-reviews-container');
  const geminiOutputContainer = document.getElementById('gemini-output-container');
  const runGeminiBtn = document.getElementById('run-gemini-btn');

  // Filter elements
  const filterPlatform = document.getElementById('filter-platform');
  const filterCategory = document.getElementById('filter-category');
  const filterReviewSearch = document.getElementById('filter-review-search');

  let fullDiscoveryData = null;

  // Fetch Discovery Data
  fetch('/api/discovery')
    .then(res => res.json())
    .then(data => {
      fullDiscoveryData = data;
      renderDiscoveryEngine(data);
      loadGeminiAnalysis();
    })
    .catch(err => console.error('Failed to load discovery data:', err));

  // Run Gemini Analysis Button
  if (runGeminiBtn) {
    runGeminiBtn.addEventListener('click', () => {
      loadGeminiAnalysis();
    });
  }

  function loadGeminiAnalysis() {
    if (!geminiOutputContainer) return;
    geminiOutputContainer.innerHTML = '<p style="color:#1a73e8;font-weight:500;">✨ Gemini 2.5 Flash is categorizing 1,000 public reviews & community feedback...</p>';

    fetch('/api/gemini-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.ai_synthesis) {
        let formatted = data.ai_synthesis
          .replace(/### (.*)/g, '<h3 style="color:#1a73e8;margin-top:10px;font-size:13px;">$1</h3>')
          .replace(/#### (.*)/g, '<h4 style="color:#202124;margin-top:8px;font-size:12px;">$1</h4>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n\n/g, '<br><br>');

        geminiOutputContainer.innerHTML = formatted;
      }
    })
    .catch(err => {
      geminiOutputContainer.innerHTML = '<p style="color:#ea4335;">Failed to load Gemini analysis.</p>';
    });
  }

  function renderDiscoveryEngine(data) {
    if (!data) return;

    // 1. Stage Breakdown
    if (stageBreakdownList) {
      stageBreakdownList.innerHTML = data.stage_breakdown.map(sb => `
        <div class="stage-item ${sb.stage_id}">
          <div class="stage-title">
            <span>${sb.stage_name}</span>
            <span class="badge ${sb.severity.toLowerCase()}">${sb.failure_count} Reviews (${sb.percentage}%)</span>
          </div>
          <div class="stage-desc">${sb.description}</div>
        </div>
      `).join('');
    }

    // 2. Metric Tree
    if (metricTreeContainer) {
      metricTreeContainer.innerHTML = `
        <p style="font-size:12px;color:#202124;font-weight:500;margin-bottom:6px;">
          Primary Target Metric: <strong>${data.metric_decomposition.primary_metric}</strong>
        </p>
        <div style="background-color:#f1f3f4;padding:6px 10px;border-radius:4px;font-size:11px;font-family:monospace;margin-bottom:8px;color:#1a73e8;border:1px solid #dadce0;">
          ${data.metric_decomposition.formula}
        </div>
        <ul style="font-size:11px;color:#3c4043;padding-left:16px;margin:0;">
          ${data.metric_decomposition.sub_metrics.map(sm => `<li>${sm.name}: <strong style="color:#1a73e8;">${sm.target}</strong></li>`).join('')}
        </ul>
      `;
    }

    // 3. Search Urgency Analytics
    if (urgencyDistributionContainer && data.search_urgency_analytics) {
      const u = data.search_urgency_analytics;
      urgencyDistributionContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="background:#fce8e6;padding:8px 10px;border-radius:6px;border-left:3px solid #ea4335;">
            <div style="font-weight:700;color:#c5221f;font-size:12px;">🚨 High Urgency (Document / Receipt Need)</div>
            <div style="font-size:16px;font-weight:700;color:#202124;margin-top:2px;">${u.high_urgency_count} Posts (50.0%)</div>
          </div>
          <div style="background:#fef7e0;padding:8px 10px;border-radius:6px;border-left:3px solid #fbbc05;">
            <div style="font-weight:700;color:#b06000;font-size:12px;">⚖️ Moderate Urgency (Memory Debate / Share)</div>
            <div style="font-size:16px;font-weight:700;color:#202124;margin-top:2px;">${u.moderate_urgency_count} Posts (26.5%)</div>
          </div>
          <div style="background:#e6f4ea;padding:8px 10px;border-radius:6px;border-left:3px solid #34a853;">
            <div style="font-weight:700;color:#137333;font-size:12px;">🌿 Low Urgency (Casual Nostalgia)</div>
            <div style="font-size:16px;font-weight:700;color:#202124;margin-top:2px;">${u.low_urgency_count} Posts (23.5%)</div>
          </div>
        </div>
      `;
    }

    // 4. Scroll Fatigue Thresholds
    if (scrollFatigueContainer && data.search_urgency_analytics) {
      scrollFatigueContainer.innerHTML = `
        <ul style="list-style:none;padding:0;margin:0;font-size:11px;">
          ${data.search_urgency_analytics.scroll_fatigue_thresholds.map(sf => `
            <li style="background:#f8f9fa;padding:8px 10px;border-radius:4px;margin-bottom:6px;border:1px solid #e0e0e0;">
              <div style="display:flex;justify-content:space-between;font-weight:500;">
                <span>⏱️ ${sf.threshold}</span>
                <span style="color:#1a73e8;font-weight:700;">${sf.user_count} users (${sf.percentage}%)</span>
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    }

    // 5. Anchor Recall Patterns
    if (anchorRecallContainer && data.search_urgency_analytics) {
      anchorRecallContainer.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:10px;">
          ${data.search_urgency_analytics.anchor_memory_types.map(a => `
            <div style="background:#fff;padding:10px;border-radius:6px;border:1px solid #dadce0;">
              <div style="font-size:11px;color:#5f6368;">Recall Strategy</div>
              <div style="font-size:12px;font-weight:700;color:#1a73e8;margin:2px 0;">${a.type}</div>
              <div style="font-size:13px;font-weight:700;color:#202124;">${a.count} Users (${a.percentage}%)</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // 6. Populate Categorized Reviews Fields
    renderCategorizedReviews(data.public_reviews || []);

    // Filter listeners
    if (filterPlatform) filterPlatform.addEventListener('change', filterReviews);
    if (filterCategory) filterCategory.addEventListener('change', filterReviews);
    if (filterReviewSearch) filterReviewSearch.addEventListener('input', filterReviews);
  }

  function filterReviews() {
    if (!fullDiscoveryData || !fullDiscoveryData.public_reviews) return;
    const platVal = filterPlatform.value;
    const catVal = filterCategory.value;
    const searchVal = filterReviewSearch.value.toLowerCase().trim();

    const filtered = fullDiscoveryData.public_reviews.filter(r => {
      const matchPlat = platVal === 'ALL' || r.platform.includes(platVal);
      const matchCat = catVal === 'ALL' || r.category.includes(catVal);
      const matchSearch = !searchVal || 
        r.review_text.toLowerCase().includes(searchVal) ||
        r.author.toLowerCase().includes(searchVal) ||
        r.category.toLowerCase().includes(searchVal) ||
        r.ai_tag.toLowerCase().includes(searchVal);

      return matchPlat && matchCat && matchSearch;
    });

    renderCategorizedReviews(filtered);
  }

  function renderCategorizedReviews(reviewsList) {
    if (!categorizedReviewsContainer) return;

    // Categorization definitions with summary notes
    const categoryConfigs = [
      {
        title: "🔍 Field 1: Query Surfacing & Semantic Search Failure",
        badge: "67.6% of Reviews (676 Posts)",
        note: "💡 Summary Note: Users attempt vague descriptive searches (e.g. 'Goa beach shack dinner bill'), but search engines fail to surface un-tagged photos lacking matching semantic tags, causing immediate search failure.",
        filterFn: r => r.category.includes("Query Surfacing")
      },
      {
        title: "⏱️ Field 2: Timeline Scroll Fatigue & Scrubber Abandonment",
        badge: "20.6% of Reviews (206 Posts)",
        note: "💡 Summary Note: Users experience extreme scroll fatigue while dragging gallery scrubbers across years of media, resulting in 76.5% search abandonment within 1 to 3 minutes.",
        filterFn: r => r.category.includes("Scroll Fatigue")
      },
      {
        title: "📍 Field 3: Metadata Loss — Missing GPS EXIF & Scanned Timestamp Mismatches",
        badge: "11.8% of Reviews (118 Posts)",
        note: "💡 Summary Note: Scanned paper prints, WhatsApp downloads, and edited media have EXIF GPS or timestamps stripped or reset to upload dates, severely disrupting chronological timeline ordering.",
        filterFn: r => r.category.includes("Metadata Loss") || r.category.includes("Timestamp") || r.category.includes("WhatsApp")
      },
      {
        title: "🚨 Field 4: High-Urgency Document & Receipt Retrieval Friction",
        badge: "50.0% of All Public Feedback",
        note: "💡 Summary Note: High-urgency practical searches for tax receipts, paper bills, warranties, or medical prescriptions have zero tolerance for search latency, driving immediate session abandonment.",
        filterFn: r => r.category.includes("Document Retrieval") || r.urgency === "High Urgency"
      }
    ];

    categorizedReviewsContainer.innerHTML = categoryConfigs.map(config => {
      const items = reviewsList.filter(config.filterFn).slice(0, 12); // Render top 12 items per category field

      return `
        <div style="background:#ffffff;border:1px solid #dadce0;border-radius:8px;padding:14px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <h4 style="font-size:13px;font-weight:700;color:#1a73e8;">${config.title}</h4>
            <span class="badge" style="background:#e8f0fe;color:#1a73e8;">${config.badge}</span>
          </div>
          <div style="background:#f8f9fa;border-left:3px solid #1a73e8;padding:8px 12px;border-radius:4px;font-size:11px;color:#3c4043;margin-bottom:12px;font-weight:500;">
            ${config.note}
          </div>
          <div class="reviews-grid">
            ${items.map(r => {
              let platClass = 'Support';
              if (r.platform.includes('Reddit')) platClass = 'Reddit';
              if (r.platform.includes('Play Store')) platClass = 'PlayStore';
              if (r.platform.includes('App Store')) platClass = 'AppStore';
              if (r.platform.includes('Twitter')) platClass = 'Twitter';

              return `
                <div class="review-card">
                  <div>
                    <div class="review-header">
                      <span class="platform-badge ${platClass}">${r.platform}</span>
                      <span style="font-size:11px;color:#fbbc04;">${r.rating_or_votes}</span>
                    </div>
                    <div class="review-author">${r.author} • <span style="color:#70757a;">${r.date}</span></div>
                    <div class="review-text">"${r.review_text}"</div>
                  </div>
                  <div class="review-footer">
                    <span style="color:#5f6368;">Tag: <strong>${r.category.split(' ')[0]}</strong></span>
                    <span class="ai-tag">🤖 ${r.ai_tag}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }
});
