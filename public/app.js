document.addEventListener('DOMContentLoaded', () => {
  // Tab Navigation Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Slide Deck Elements
  const activeSlideCard = document.getElementById('active-slide-card');
  const slideIndicator = document.getElementById('slide-indicator');
  const prevSlideBtn = document.getElementById('prev-slide-btn');
  const nextSlideBtn = document.getElementById('next-slide-btn');
  const slideThumbnails = document.getElementById('slide-thumbnails');

  // Discovery Engine Elements (UI #1)
  const stageBreakdownList = document.getElementById('stage-breakdown-list');
  const metricTreeContainer = document.getElementById('metric-tree-container');
  const evidenceTableBody = document.getElementById('evidence-table-body');

  // MVP Elements (UI #2)
  const queryInput = document.getElementById('query-input');
  const searchBtn = document.getElementById('search-btn');
  const presetButtonsContainer = document.getElementById('preset-buttons');
  const signalPanel = document.getElementById('signal-panel');
  const candidateSection = document.getElementById('candidate-section');
  const candidateGrid = document.getElementById('candidate-grid');
  const contextSection = document.getElementById('context-section');
  const contextGrid = document.getElementById('context-grid');
  const anchorSummaryCard = document.getElementById('anchor-summary-card');
  const contextStatusBanner = document.getElementById('context-status-banner');

  let currentSlideIndex = 0;
  let slideData = [];

  // Tab Switching Logic
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
      });

      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active');
      }
    });
  });

  // 1. LOAD SLIDE DECK (10 Slides)
  fetch('/api/deck')
    .then(res => res.json())
    .then(data => {
      slideData = data.slides || [];
      renderSlide(currentSlideIndex);
      renderSlideThumbnails();
    })
    .catch(err => console.error('Failed to load slide deck:', err));

  prevSlideBtn.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      renderSlide(currentSlideIndex);
    }
  });

  nextSlideBtn.addEventListener('click', () => {
    if (currentSlideIndex < slideData.length - 1) {
      currentSlideIndex++;
      renderSlide(currentSlideIndex);
    }
  });

  function renderSlide(index) {
    if (!slideData || slideData.length === 0) return;
    const slide = slideData[index];
    slideIndicator.textContent = `Slide ${slide.slide_number} / ${slideData.length}`;

    activeSlideCard.innerHTML = `
      <h2>${slide.title}</h2>
      <div class="slide-subtitle">${slide.subtitle}</div>
      <ul class="slide-bullets">
        ${slide.content.map(bullet => `<li>${formatMarkdown(bullet)}</li>`).join('')}
      </ul>
    `;

    // Highlight active thumbnail
    const thumbs = slideThumbnails.querySelectorAll('.thumb-btn');
    thumbs.forEach((t, i) => {
      if (i === index) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  function renderSlideThumbnails() {
    slideThumbnails.innerHTML = '';
    slideData.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = `thumb-btn ${i === currentSlideIndex ? 'active' : ''}`;
      btn.textContent = `Slide ${s.slide_number}`;
      btn.addEventListener('click', () => {
        currentSlideIndex = i;
        renderSlide(currentSlideIndex);
      });
      slideThumbnails.appendChild(btn);
    });
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  // 2. LOAD DISCOVERY ENGINE (UI #1)
  fetch('/api/discovery')
    .then(res => res.json())
    .then(discoveryData => {
      renderDiscoveryEngine(discoveryData);
    })
    .catch(err => console.error('Failed to load discovery engine data:', err));

  function renderDiscoveryEngine(data) {
    if (!data) return;

    // Stage Breakdown
    stageBreakdownList.innerHTML = data.stage_breakdown.map(sb => `
      <div class="stage-item">
        <div class="stage-title">
          <span>${sb.stage_name}</span>
          <span class="badge">${sb.failure_count} Failure Records (${sb.percentage}%)</span>
        </div>
        <div class="stage-desc">${sb.description}</div>
      </div>
    `).join('');

    // Metric Tree
    metricTreeContainer.innerHTML = `
      <p style="font-size:13px;color:#202124;font-weight:500;margin-bottom:8px;">
        Primary Metric: <strong>${data.metric_decomposition.primary_metric}</strong>
      </p>
      <div style="background-color:#f1f3f4;padding:8px 12px;border-radius:6px;font-size:12px;font-family:monospace;margin-bottom:12px;">
        ${data.metric_decomposition.formula}
      </div>
      <p style="font-size:12px;color:#5f6368;font-weight:500;">Metric Decomposition Sub-Targets:</p>
      <ul style="font-size:12px;color:#3c4043;padding-left:20px;margin-top:4px;">
        ${data.metric_decomposition.sub_metrics.map(sm => `<li>${sm.name}: <strong>${sm.target}</strong></li>`).join('')}
      </ul>
    `;

    // Sample Evidence Table
    evidenceTableBody.innerHTML = data.evidence_records.map(e => `
      <tr>
        <td><strong>${e.record_id}</strong></td>
        <td>${e.user_persona}</td>
        <td>"${e.vague_query_prompt}"</td>
        <td>${e.target_photo_description}</td>
        <td><span class="badge">${e.failure_stage}</span></td>
        <td style="font-size:12px;color:#5f6368">${e.primary_root_cause}</td>
      </tr>
    `).join('');
  }

  // 3. LOAD MVP PRESET SCENARIOS & INTERACTION (UI #2)
  fetch('/api/scenarios')
    .then(res => res.json())
    .then(scenarios => {
      presetButtonsContainer.innerHTML = '';
      scenarios.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.textContent = s.scenario_name;
        btn.addEventListener('click', () => {
          queryInput.value = s.raw_query;
          executeSearch(s.raw_query);
        });
        presetButtonsContainer.appendChild(btn);
      });
    })
    .catch(err => console.error('Failed to load scenarios:', err));

  searchBtn.addEventListener('click', () => {
    const q = queryInput.value.trim();
    if (q) executeSearch(q);
  });

  queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = queryInput.value.trim();
      if (q) executeSearch(q);
    }
  });

  function executeSearch(query) {
    contextSection.style.display = 'none';

    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(data => {
      renderSignalPanel(data.signal);
      renderCandidateAnchors(data.candidates);
    })
    .catch(err => console.error('Search error:', err));
  }

  function renderSignalPanel(signal) {
    signalPanel.style.display = 'block';
    document.getElementById('confidence-badge').textContent = `Confidence: ${(signal.parser_metadata.confidence_score * 100).toFixed(0)}%`;
    document.getElementById('signal-intent').textContent = signal.search_intent;

    const anchorContainer = document.getElementById('signal-anchor-tags');
    anchorContainer.innerHTML = (signal.extracted_signals.anchor_keywords.length > 0)
      ? signal.extracted_signals.anchor_keywords.map(k => `<span class="tag">${k}</span>`).join('')
      : '<span class="signal-value" style="font-size:12px;color:#80868b">None (Direct Target Search)</span>';

    const targetContainer = document.getElementById('signal-target-tags');
    targetContainer.innerHTML = (signal.extracted_signals.target_descriptors.length > 0)
      ? signal.extracted_signals.target_descriptors.map(k => `<span class="tag target-tag">${k}</span>`).join('')
      : '<span class="signal-value" style="font-size:12px;color:#80868b">None</span>';
  }

  function renderCandidateAnchors(candidates) {
    candidateSection.style.display = 'block';
    candidateGrid.innerHTML = '';

    if (!candidates || candidates.length === 0) {
      candidateGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#5f6368;">No candidate anchor photos found matching query terms.</p>';
      return;
    }

    candidates.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.innerHTML = `
        <div class="card-image-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span class="photo-badge">Prototype Similarity Score: ${photo.score.toFixed(2)}</span>
        </div>
        <div class="card-content">
          <div class="card-filename">${photo.filename}</div>
          <div class="card-desc">${photo.scene_description}</div>
          <div class="card-meta">
            📍 ${photo.location_name || 'No GPS'}<br>
            🕒 ${photo.timestamp ? new Date(photo.timestamp).toLocaleString() : 'No EXIF Timestamp'}
          </div>
          <button class="jump-btn" data-photo-id="${photo.photo_id}">
            ⚡ Contextual Jump & Expand (1-Tap)
          </button>
        </div>
      `;

      card.querySelector('.jump-btn').addEventListener('click', () => {
        executeContextExpansion(photo);
      });

      candidateGrid.appendChild(card);
    });
  }

  function executeContextExpansion(anchorPhoto) {
    fetch(`/api/expand?anchor_id=${anchorPhoto.photo_id}`)
      .then(res => res.json())
      .then(contextRes => {
        renderContextGrid(anchorPhoto, contextRes);
      })
      .catch(err => console.error('Context expansion error:', err));
  }

  function renderContextGrid(anchorPhoto, contextRes) {
    contextSection.style.display = 'block';
    contextSection.scrollIntoView({ behavior: 'smooth' });

    anchorSummaryCard.innerHTML = `
      <h3>Selected Anchor Photo: <strong>${anchorPhoto.photo_id}</strong> (${anchorPhoto.filename})</h3>
      <p style="font-size:13px;color:#3c4043;margin-top:4px;">
        Location: ${anchorPhoto.location_name || 'N/A'} | Timestamp: ${anchorPhoto.timestamp ? new Date(anchorPhoto.timestamp).toLocaleString() : 'Missing EXIF'}
      </p>
      <p style="font-size:12px;color:#5f6368;margin-top:4px;">
        Expansion Criteria: Temporal Window ±4.0 Hours | Spatial Radius ≤1.0 km
      </p>
    `;

    contextStatusBanner.className = 'context-status-banner';
    contextGrid.innerHTML = '';

    if (contextRes.status === 'SUCCESS') {
      contextStatusBanner.classList.add('status-success');
      contextStatusBanner.innerHTML = `✅ <strong>Context Expansion Successful:</strong> Found ${contextRes.photos_found_count} photos within ±4.0h & ≤1.0km context window.`;

      contextRes.photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';

        card.innerHTML = `
          <div class="card-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span class="photo-badge">Δt: ${photo.time_delta_hours} hrs</span>
          </div>
          <div class="card-content">
            <div class="card-filename">${photo.filename}</div>
            <div class="card-desc">${photo.scene_description}</div>
            <div class="card-meta">
              📍 ${photo.location_name || 'No GPS'}<br>
              🕒 ${new Date(photo.timestamp).toLocaleString()}
            </div>
          </div>
        `;
        contextGrid.appendChild(card);
      });

    } else if (contextRes.status === 'MISSING_EXIF_FALLBACK') {
      contextStatusBanner.classList.add('status-fallback');
      contextStatusBanner.innerHTML = `
        ⚠️ <strong>${contextRes.message}</strong><br>
        <button class="fallback-affordance-btn">📅 ${contextRes.fallback_affordance}</button>
      `;
      contextGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#80868b;padding:24px;">EXIF metadata missing. Context window cannot be calculated via timestamp offset.</p>';

    } else if (contextRes.status === 'SPARSE_CONTEXT') {
      contextStatusBanner.classList.add('status-sparse');
      contextStatusBanner.innerHTML = `ℹ️ <strong>${contextRes.message}</strong>`;
      contextGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#80868b;padding:24px;">No additional photos were taken within ±4.0 hours or ≤1.0 km radius of this anchor photo.</p>';
    }
  }
});
