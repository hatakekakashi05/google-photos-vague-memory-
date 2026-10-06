document.addEventListener('DOMContentLoaded', () => {
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
