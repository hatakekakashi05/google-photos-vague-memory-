const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../apps/retrieval-mvp/data/synthetic_photos_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 100% Unique real-world Unsplash image URLs mapped to each exact photo ID
const exactUniqueImageMap = {
  // GOA TRIP
  "GOA_001": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop", // Hotel Lobby
  "GOA_002": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop", // Pool Lounger
  "GOA_003": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", // Sunset Beach Walk
  "GOA_004": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop", // Shack Dinner Toast
  "GOA_005": "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop", // Dinner Bill Receipt
  "GOA_006": "https://images.unsplash.com/photo-1496545614046-af44eb7478d3?w=600&auto=format&fit=crop", // Beach Bonfire Night

  // YOSEMITE HIKE
  "HIKE_001": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop", // Mountain Trailhead Sign
  "HIKE_002": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop", // Mountain Ridge Vista
  "HIKE_003": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&auto=format&fit=crop", // Mountain Waterfall
  "HIKE_004": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop", // Mountain Lodge Hot Soup
  "HIKE_005": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&auto=format&fit=crop", // Alpine Campfire Dusk

  // VINTAGE REUNION
  "VIN_001": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop", // Vintage Family Reunion
  "VIN_002": "https://images.unsplash.com/photo-1567057419565-4349c49d8a04?w=600&auto=format&fit=crop", // Smiling Grandparents in Backyard Garden
  "VIN_003": "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=600&auto=format&fit=crop", // 1980s Family Dinner Gathering
  "VIN_004": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop", // Black & White Porch Steps
  "VIN_005": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop", // Vintage Photo Album Page

  // SPARSE OFFICE RECEIPT
  "REC_001": "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop", // Office Desk Receipt
  "REC_002": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop", // Cafe Meeting Receipt
  "REC_003": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop", // Laptop Workspace Setup
  "REC_004": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop", // Whiteboard Brainstorm
  "REC_005": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop", // Team Office Lunch

  // BIRTHDAY PARTY
  "BDAY_001": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop", // Birthday Cake Candles
  "BDAY_002": "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop", // Party Balloons Decor
  "BDAY_003": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop", // Friends Birthday Toast
  "BDAY_004": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop", // Opening Birthday Gifts
  "BDAY_005": "https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?w=600&auto=format&fit=crop"  // Night Sparklers Celebration
};

dataset.photos.forEach((photo) => {
  if (exactUniqueImageMap[photo.photo_id]) {
    photo.image_url = exactUniqueImageMap[photo.photo_id];
  }
});

fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2), 'utf8');
console.log('Successfully mapped 100% UNIQUE real-world Unsplash image URLs to all photos in apps/retrieval-mvp/data/synthetic_photos_dataset.json!');
