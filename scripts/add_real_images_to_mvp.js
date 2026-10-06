const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../apps/retrieval-mvp/data/synthetic_photos_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const sceneImageMap = {
  // Goa Trip
  "GOA_001": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop", // Hotel Lobby
  "GOA_002": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop", // Poolside
  "GOA_003": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", // Beach Walk Sunset
  "GOA_004": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop", // Shack Toast Dinner
  "GOA_005": "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop", // Shack Bill Receipt

  // Yosemite Mountain Trip
  "YOS_001": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop", // Mountain Trail
  "YOS_002": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop", // Misty Pines
  "YOS_003": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop", // Mountain Cabin Exterior
  "YOS_004": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop", // Cabin Hot Soup Meal
  "YOS_005": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop", // Evening Campfire

  // Vintage Family Reunion Scan
  "FAM_001": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop", // Vintage Family Photo
  "FAM_002": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop", // Grandparents Portrait Scan
  "FAM_003": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop", // Old Wedding Gathering
  "FAM_004": "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop", // Anniversary Celebration

  // Office Work Desk Receipt
  "OFF_001": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop", // Office Tech Building
  "OFF_002": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop", // Work Desk Laptop
  "OFF_003": "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop", // Paper Expense Receipt
  "OFF_004": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop", // Document Signing

  // Birthday Evening Party
  "BDAY_001": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop", // Birthday Cake Candles
  "BDAY_002": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop", // Party Balloons & Friends
  "BDAY_003": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop"  // Evening Dinner Celebration
};

// Fallback high quality Unsplash image category pools
const defaultImagePool = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop"
];

dataset.photos.forEach((photo, idx) => {
  if (sceneImageMap[photo.photo_id]) {
    photo.image_url = sceneImageMap[photo.photo_id];
  } else {
    photo.image_url = defaultImagePool[idx % defaultImagePool.length];
  }
});

fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2), 'utf8');
console.log('Successfully updated apps/retrieval-mvp/data/synthetic_photos_dataset.json with real Unsplash images!');
