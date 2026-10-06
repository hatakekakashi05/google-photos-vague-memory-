document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('query-input');
  const searchBtn = document.getElementById('search-btn');
  const presetButtonsContainer = document.getElementById('preset-buttons');
  const signalPanel = document.getElementById('signal-panel');
  const resultsTitle = document.getElementById('results-title');
  const resultsCount = document.getElementById('results-count');
  const photoGrid = document.getElementById('photo-grid');

  let allPhotos = [];

  // Fetch scenarios and photos dataset
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
      // Default initial load
      if (scenarios.length > 0) {
        queryInput.value = scenarios[0].raw_query;
        executeSearch(scenarios[0].raw_query);
      }
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
    if (!signalPanel) return;
    signalPanel.style.display = 'block';
    const confBadge = document.getElementById('confidence-badge');
    if (confBadge) confBadge.textContent = `Confidence: ${(signal.parser_metadata.confidence_score * 100).toFixed(0)}%`;
    const intentElem = document.getElementById('signal-intent');
    if (intentElem) intentElem.textContent = signal.search_intent;

    const anchorContainer = document.getElementById('signal-anchor-tags');
    if (anchorContainer) {
      anchorContainer.innerHTML = (signal.extracted_signals.anchor_keywords.length > 0)
        ? signal.extracted_signals.anchor_keywords.map(k => `<span class="tag">${k}</span>`).join('')
        : '<span style="font-size:12px;color:#80868b">Direct Search</span>';
    }

    const targetContainer = document.getElementById('signal-target-tags');
    if (targetContainer) {
      targetContainer.innerHTML = (signal.extracted_signals.target_descriptors.length > 0)
        ? signal.extracted_signals.target_descriptors.map(k => `<span class="tag target-tag">${k}</span>`).join('')
        : '<span style="font-size:12px;color:#80868b">None</span>';
    }
  }

  function renderCandidateAnchors(candidates) {
    if (!photoGrid) return;
    photoGrid.innerHTML = '';
    resultsTitle.textContent = "Candidate Surfacing Results";
    resultsCount.textContent = `${candidates ? candidates.length : 0} Photos`;

    if (!candidates || candidates.length === 0) {
      photoGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#5f6368;padding:24px;">No candidate photos found matching query terms.</p>';
      return;
    }

    candidates.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      const imgUrl = photo.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop';

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${imgUrl}" alt="${photo.scene_description || 'Google Photo'}" class="photo-img" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-filename">${photo.filename || photo.photo_id}</div>
          <div class="card-desc">${photo.scene_description || ''}</div>
          <div class="card-meta">
            📍 ${photo.location_name || 'No GPS'}<br>
            🕒 ${photo.timestamp ? new Date(photo.timestamp).toLocaleString() : 'Missing EXIF Timestamp'}
          </div>
          <button class="jump-btn" data-photo-id="${photo.photo_id}">
            ⚡ 1-Tap Contextual Jump & Expand (±4.0h, ≤1.0km)
          </button>
        </div>
      `;

      card.querySelector('.jump-btn').addEventListener('click', () => {
        executeContextExpansion(photo);
      });

      photoGrid.appendChild(card);
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
    if (!photoGrid) return;
    photoGrid.innerHTML = '';
    resultsTitle.textContent = `1-Tap Timeline Context Window for: ${anchorPhoto.photo_id}`;
    resultsCount.textContent = `${contextRes.photos_found_count || 0} Expanded Photos`;

    if (contextRes.status === 'SUCCESS' && contextRes.photos) {
      contextRes.photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        const imgUrl = photo.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop';
        const isTarget = photo.is_target_photo;

        card.innerHTML = `
          <div class="card-image-wrapper">
            <img src="${imgUrl}" alt="${photo.scene_description || 'Google Photo'}" class="photo-img" loading="lazy" />
            ${isTarget ? '<span class="target-badge">🎯 Target Item Recovered</span>' : ''}
          </div>
          <div class="card-content">
            <div class="card-filename">${photo.filename || photo.photo_id}</div>
            <div class="card-desc">${photo.scene_description || ''}</div>
            <div class="card-meta">
              📍 ${photo.location_name || 'No GPS'}<br>
              🕒 ${photo.timestamp ? new Date(photo.timestamp).toLocaleString() : 'Missing EXIF'}<br>
              ⏱️ Offset: ${photo.time_delta_hours || '0.0'} hrs
            </div>
          </div>
        `;
        photoGrid.appendChild(card);
      });
    } else {
      photoGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#5f6368;padding:24px;">${contextRes.message || 'No photos found in offset window.'}</p>`;
    }
  }
});
