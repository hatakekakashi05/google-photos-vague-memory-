document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('query-input');
  const searchBtn = document.getElementById('search-btn');
  const presetButtonsContainer = document.getElementById('preset-buttons');
  const resultsTitle = document.getElementById('results-title');
  const resultsCount = document.getElementById('results-count');
  const backToResultsBtn = document.getElementById('back-to-results-btn');
  const photoGrid = document.getElementById('photo-grid');

  let lastCandidates = [];
  let currentQuery = '';

  // Load preset scenario pills
  fetch('/api/scenarios')
    .then(res => res.json())
    .then(scenarios => {
      presetButtonsContainer.innerHTML = '';
      scenarios.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'preset-pill';
        btn.textContent = s.scenario_name;
        btn.addEventListener('click', () => {
          queryInput.value = s.raw_query;
          executeSearch(s.raw_query);
        });
        presetButtonsContainer.appendChild(btn);
      });
      // Initial load with first scenario
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

  if (backToResultsBtn) {
    backToResultsBtn.addEventListener('click', () => {
      renderCandidateAnchors(lastCandidates);
    });
  }

  function executeSearch(query) {
    currentQuery = query;
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(data => {
      lastCandidates = data.candidates || [];
      renderCandidateAnchors(lastCandidates);
    })
    .catch(err => console.error('Search error:', err));
  }

  function renderCandidateAnchors(candidates) {
    if (!photoGrid) return;
    photoGrid.innerHTML = '';
    resultsTitle.textContent = "Search Results";
    resultsCount.textContent = `${candidates ? candidates.length : 0} Photos`;
    if (backToResultsBtn) backToResultsBtn.style.display = 'none';

    if (!candidates || candidates.length === 0) {
      photoGrid.innerHTML = '<p class="empty-state">No matching photos found in your archive.</p>';
      return;
    }

    candidates.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'photo-card';

      const dateStr = photo.timestamp
        ? new Date(photo.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Archive Photo';

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${photo.image_url}" alt="${photo.scene_description}" class="photo-img" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-desc">${photo.scene_description || ''}</div>
          <div class="card-meta">
            📍 ${photo.location_name || 'Photos Archive'} • ${dateStr}
          </div>
          <button class="jump-btn" data-photo-id="${photo.photo_id}">
            Jump to Timeline Context
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
    
    resultsTitle.textContent = `Timeline Context around: ${anchorPhoto.scene_description ? anchorPhoto.scene_description.substring(0, 45) + '...' : anchorPhoto.photo_id}`;
    resultsCount.textContent = `${contextRes.photos_found_count || 0} Surrounding Photos`;
    if (backToResultsBtn) backToResultsBtn.style.display = 'inline-flex';

    if (contextRes.status === 'SUCCESS' && contextRes.photos && contextRes.photos.length > 0) {
      contextRes.photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card context-card';

        const dateStr = photo.timestamp
          ? new Date(photo.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Timeline Photo';

        card.innerHTML = `
          <div class="card-image-wrapper">
            <img src="${photo.image_url}" alt="${photo.scene_description}" class="photo-img" loading="lazy" />
            <span class="context-badge">Timeline Context</span>
          </div>
          <div class="card-content">
            <div class="card-desc">${photo.scene_description || ''}</div>
            <div class="card-meta">
              📍 ${photo.location_name || 'Photos Archive'} • ${dateStr}
            </div>
          </div>
        `;
        photoGrid.appendChild(card);
      });
    } else {
      photoGrid.innerHTML = `<p class="empty-state">No additional surrounding photos found in this timeline context.</p>`;
    }
  }
});
