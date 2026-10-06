const fs = require('fs');

class RetrievalEngine {
  /**
   * AI-Native Prototype Hybrid Retrieval Engine for CFM-01.
   * Strict Governance Compliance:
   * - Ground-truth fields ('scenario_id', 'is_anchor_candidate', 'is_target_photo') are NEVER passed to ranking or retrieval.
   * - Operates exclusively on observable signals: text tokens, cosine similarity, ISO timestamps, and GPS coordinates.
   */
  constructor(datasetPath) {
    const rawData = fs.readFileSync(datasetPath, 'utf8');
    this.datasetRaw = JSON.parse(rawData);
    this.photos = this.datasetRaw.photos || [];
  }

  tokenize(text) {
    if (!text) return [];
    const tokens = text.toLowerCase().match(/\w+/g) || [];
    return tokens.filter(t => t.length > 1);
  }

  computeCosineSimilarity(queryTokens, docTokens) {
    if (!queryTokens.length || !docTokens.length) return 0.0;

    const queryFreq = {};
    for (const t of queryTokens) {
      queryFreq[t] = (queryFreq[t] || 0) + 1;
    }

    const docFreq = {};
    for (const t of docTokens) {
      docFreq[t] = (docFreq[t] || 0) + 1;
    }

    let dotProduct = 0;
    for (const t in queryFreq) {
      if (docFreq[t]) {
        dotProduct += queryFreq[t] * docFreq[t];
      }
    }

    const queryMag = Math.sqrt(Object.values(queryFreq).reduce((acc, v) => acc + v * v, 0));
    const docMag = Math.sqrt(Object.values(docFreq).reduce((acc, v) => acc + v * v, 0));

    if (queryMag === 0 || docMag === 0) return 0.0;

    return dotProduct / (queryMag * docMag);
  }

  searchCandidateAnchors(query, topK = 5) {
    const queryTokens = this.tokenize(query);
    const results = [];

    for (const photo of this.photos) {
      const docText = (photo.scene_description || '') + ' ' + (photo.tags || []).join(' ');
      const docTokens = this.tokenize(docText);
      const similarity = this.computeCosineSimilarity(queryTokens, docTokens);

      // Sanitized copy without ground truth labels
      const photoCopy = {
        photo_id: photo.photo_id,
        filename: photo.filename,
        timestamp: photo.timestamp,
        location_name: photo.location_name,
        latitude: photo.latitude,
        longitude: photo.longitude,
        scene_description: photo.scene_description,
        tags: photo.tags,
        score: Math.round(similarity * 10000) / 10000
      };
      results.push(photoCopy);
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371.0; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  expandContext(anchorPhotoId, timeWindowHours = 4.0, maxDistanceKm = 1.0) {
    const anchorPhoto = this.photos.find(p => p.photo_id === anchorPhotoId);
    if (!anchorPhoto) {
      return { status: 'ERROR', message: 'Anchor photo not found', photos: [] };
    }

    const anchorTimeStr = anchorPhoto.timestamp;
    const anchorLat = anchorPhoto.latitude;
    const anchorLon = anchorPhoto.longitude;

    if (!anchorTimeStr) {
      return {
        status: 'MISSING_EXIF_FALLBACK',
        message: 'Missing timestamp EXIF metadata. Displaying View Date in Timeline fallback.',
        fallback_affordance: 'View Date in Timeline',
        photos: []
      };
    }

    const anchorTime = new Date(anchorTimeStr).getTime();
    const contextPhotos = [];

    for (const photo of this.photos) {
      if (photo.photo_id === anchorPhotoId) continue;
      if (!photo.timestamp) continue;

      const pTime = new Date(photo.timestamp).getTime();
      const timeDiffHours = Math.abs(pTime - anchorTime) / (1000 * 3600);

      if (timeDiffHours <= timeWindowHours) {
        let inSpatialRange = true;
        if (anchorLat !== null && anchorLon !== null && photo.latitude !== null && photo.longitude !== null) {
          const dist = this.haversineDistance(anchorLat, anchorLon, photo.latitude, photo.longitude);
          if (dist > maxDistanceKm) inSpatialRange = false;
        }

        if (inSpatialRange) {
          contextPhotos.push({
            photo_id: photo.photo_id,
            filename: photo.filename,
            timestamp: photo.timestamp,
            location_name: photo.location_name,
            scene_description: photo.scene_description,
            tags: photo.tags,
            time_delta_hours: Math.round(timeDiffHours * 100) / 100
          });
        }
      }
    }

    contextPhotos.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (contextPhotos.length === 0) {
      return {
        status: 'SPARSE_CONTEXT',
        message: 'No Additional Photos Found in window.',
        photos: []
      };
    }

    return {
      status: 'SUCCESS',
      anchor_id: anchorPhotoId,
      time_window_hours: timeWindowHours,
      max_distance_km: maxDistanceKm,
      photos_found_count: contextPhotos.length,
      photos: contextPhotos
    };
  }
}

module.exports = RetrievalEngine;
