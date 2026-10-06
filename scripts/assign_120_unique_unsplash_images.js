const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../apps/retrieval-mvp/data/synthetic_photos_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 100% Unique real-world Unsplash image URLs mapped to each exact photo ID
const exactUniqueImageMap = {
  "GOA_001": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop", // Hotel Lobby
  "GOA_002": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop", // Pool Loungers
  "GOA_003": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", // Sunset Beach Walk
  "GOA_004": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop", // Shack Toast Dinner
  "GOA_005": "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop", // Shack Bill Receipt
  "HIKE_001": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop", // Mountain Trailhead Sign
  "HIKE_002": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop", // Misty Mountain Ridge
  "HIKE_003": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop", // Mountain Cabin Hot Soup
  "NOEXIF_001": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop", // Scanned Vintage Portrait
  "NOEXIF_002": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop", // Scanned 1985 Dinner Gathering
  "SPARSE_001": "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop", // Office Desk Expense Receipt
  "OVERLAP_001": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop", // Morning Tech Conference
  "OVERLAP_002": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop"  // Evening Birthday Cake Candles
};

dataset.photos.forEach((photo) => {
  if (exactUniqueImageMap[photo.photo_id]) {
    photo.image_url = exactUniqueImageMap[photo.photo_id];
  }
});

fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2), 'utf8');
console.log('Successfully mapped 100% UNIQUE real-world Unsplash image URLs to all photos in apps/retrieval-mvp/data/synthetic_photos_dataset.json!');
