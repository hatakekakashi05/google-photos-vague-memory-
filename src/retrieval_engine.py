import json
import math
import re
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

class RetrievalEngine:
    """
    AI-Native Prototype Hybrid Retrieval Engine for CFM-01.
    Strict Governance Compliance:
    - Ground-truth fields ('scenario_id', 'is_anchor_candidate', 'is_target_photo') are NEVER passed to ranking or retrieval.
    - Operates exclusively on observable signals: text tokens, cosine similarity, ISO timestamps, and GPS coordinates.
    """
    
    def __init__(self, dataset_path: str):
        with open(dataset_path, 'r', encoding='utf-8') as f:
            self.dataset_raw = json.load(f)
        self.photos = self.dataset_raw.get('photos', [])
        
    def _tokenize(self, text: str) -> List[str]:
        if not text:
            return []
        text = text.lower()
        tokens = re.findall(r'\w+', text)
        return [t for t in tokens if len(t) > 1]
    
    def _compute_cosine_similarity(self, query_tokens: List[str], doc_tokens: List[str]) -> float:
        if not query_tokens or not doc_tokens:
            return 0.0
        
        query_freq = {}
        for t in query_tokens:
            query_freq[t] = query_freq.get(t, 0) + 1
            
        doc_freq = {}
        for t in doc_tokens:
            doc_freq[t] = doc_freq.get(t, 0) + 1
            
        dot_product = sum(query_freq[t] * doc_freq.get(t, 0) for t in query_freq)
        query_mag = math.sqrt(sum(v**2 for v in query_freq.values()))
        doc_mag = math.sqrt(sum(v**2 for v in doc_freq.values()))
        
        if query_mag == 0 or doc_mag == 0:
            return 0.0
        
        return dot_product / (query_mag * doc_mag)
    
    def search_candidate_anchors(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves candidate anchor photos using observable text similarity signals.
        Ground-truth labels are NOT used.
        """
        query_tokens = self._tokenize(query)
        results = []
        
        for photo in self.photos:
            doc_text = photo.get('scene_description', '') + ' ' + ' '.join(photo.get('tags', []))
            doc_tokens = self._tokenize(doc_text)
            similarity = self._compute_cosine_similarity(query_tokens, doc_tokens)
            
            # Sanitized copy for search results (stripping ground truth labels for safety)
            photo_copy = {
                'photo_id': photo['photo_id'],
                'filename': photo['filename'],
                'timestamp': photo['timestamp'],
                'location_name': photo['location_name'],
                'latitude': photo['latitude'],
                'longitude': photo['longitude'],
                'scene_description': photo['scene_description'],
                'tags': photo['tags'],
                'score': round(similarity, 4)
            }
            results.append(photo_copy)
            
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_k]

    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates distance in kilometers between two GPS points."""
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def expand_context(self, anchor_photo_id: str, time_window_hours: float = 4.0, max_distance_km: float = 1.0) -> Dict[str, Any]:
        """
        Executes Contextual Expansion from a selected anchor photo using temporal & spatial window rules.
        """
        anchor_photo = next((p for p in self.photos if p['photo_id'] == anchor_photo_id), None)
        if not anchor_photo:
            return {'status': 'ERROR', 'message': 'Anchor photo not found', 'photos': []}

        anchor_time_str = anchor_photo.get('timestamp')
        anchor_lat = anchor_photo.get('latitude')
        anchor_lon = anchor_photo.get('longitude')

        # Fallback handling for missing EXIF metadata
        if not anchor_time_str:
            return {
                'status': 'MISSING_EXIF_FALLBACK',
                'message': 'Missing timestamp EXIF metadata. Displaying View Date in Timeline fallback.',
                'fallback_affordance': 'View Date in Timeline',
                'photos': []
            }

        anchor_dt = datetime.fromisoformat(anchor_time_str.replace('Z', '+00:00'))
        context_photos = []

        for photo in self.photos:
            # Skip exact same anchor item from context grid
            if photo['photo_id'] == anchor_photo_id:
                continue

            p_time_str = photo.get('timestamp')
            if not p_time_str:
                continue

            p_dt = datetime.fromisoformat(p_time_str.replace('Z', '+00:00'))
            time_diff_hours = abs((p_dt - anchor_dt).total_seconds()) / 3600.0

            # Temporal window check
            if time_diff_hours <= time_window_hours:
                # Spatial distance check if GPS available
                in_spatial_range = True
                if anchor_lat is not None and anchor_lon is not None and photo.get('latitude') is not None and photo.get('longitude') is not None:
                    dist = self._haversine_distance(anchor_lat, anchor_lon, photo['latitude'], photo['longitude'])
                    if dist > max_distance_km:
                        in_spatial_range = False

                if in_spatial_range:
                    context_photos.append({
                        'photo_id': photo['photo_id'],
                        'filename': photo['filename'],
                        'timestamp': photo['timestamp'],
                        'location_name': photo['location_name'],
                        'scene_description': photo['scene_description'],
                        'tags': photo['tags'],
                        'time_delta_hours': round(time_diff_hours, 2)
                    })

        # Sort context photos by timestamp
        context_photos.sort(key=lambda x: x['timestamp'])

        if not context_photos:
            return {
                'status': 'SPARSE_CONTEXT',
                'message': 'No Additional Photos Found in window.',
                'photos': []
            }

        return {
            'status': 'SUCCESS',
            'anchor_id': anchor_photo_id,
            'time_window_hours': time_window_hours,
            'max_distance_km': max_distance_km,
            'photos_found_count': len(context_photos),
            'photos': context_photos
        }

if __name__ == '__main__':
    # Test execution
    engine = RetrievalEngine('c:/Users/Amar/Desktop/workspaceforag/res/data/synthetic_photos_dataset.json')
    query = "sunset beach trip with friends"
    anchors = engine.search_candidate_anchors(query, top_k=3)
    print(f"Query: '{query}'")
    print("Top Candidate Anchors:")
    for a in anchors:
        print(f" - {a['photo_id']} (Score: {a['score']}): {a['scene_description']}")
    
    if anchors:
        first_anchor_id = anchors[0]['photo_id']
        context = engine.expand_context(first_anchor_id)
        print(f"\nContext Expansion for Anchor {first_anchor_id}:")
        print(f" Status: {context['status']}")
        print(f" Items Found: {context.get('photos_found_count', 0)}")
        for cp in context.get('photos', []):
            print(f"   * {cp['photo_id']} (Δt: {cp['time_delta_hours']}h): {cp['scene_description']}")
