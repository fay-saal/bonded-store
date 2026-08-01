// ── Default Product Catalog (12 Products) ─────────────────────────
window.DEFAULT_PRODUCTS = [
  {
    id: 'netflix-premium', name: 'Netflix Premium', category: 'streaming',
    description: 'Full HD & Ultra HD streaming. Four screens simultaneously.',
    price: { amount: 350, currency: 'BDT', display: '৳350' },
    icon: 'netflix', badge: 'Popular', available: true, rating: 4.8,
  },
  {
    id: 'spotify-premium', name: 'Spotify Premium', category: 'streaming',
    description: 'Ad-free music streaming. Offline downloads.',
    price: { amount: 250, currency: 'BDT', display: '৳250' },
    icon: 'spotify', badge: null, available: true, rating: 4.7,
  },
  {
    id: 'youtube-premium', name: 'YouTube Premium', category: 'streaming',
    description: 'Ad-free videos. Background play. YouTube Music included.',
    price: { amount: 300, currency: 'BDT', display: '৳300' },
    icon: 'youtube', badge: null, available: true, rating: 4.6,
  },
  {
    id: 'discord-nitro', name: 'Discord Nitro', category: 'social',
    description: 'HD streaming. Custom emojis everywhere.',
    price: { amount: 850, currency: 'BDT', display: '৳850' },
    icon: 'discord', badge: 'Popular', available: true, rating: 4.9,
  },
  {
    id: 'canva-pro', name: 'Canva Pro', category: 'utility',
    description: 'Premium templates. Magic Resize. Brand Kit.',
    price: { amount: 200, currency: 'BDT', display: '৳200' },
    icon: 'canva', badge: 'New', available: true, rating: 4.5,
  },
  {
    id: 'crunchyroll-premium', name: 'Crunchyroll Premium', category: 'streaming',
    description: 'Ad-free anime. Simulcast from Japan.',
    price: { amount: 300, currency: 'BDT', display: '৳300' },
    icon: 'crunchyroll', badge: null, available: true, rating: 4.4,
  },
  {
    id: 'xbox-game-pass', name: 'Xbox Game Pass', category: 'gaming',
    description: 'Hundreds of games. Day one releases. EA Play included.',
    price: { amount: 500, currency: 'BDT', display: '৳500' },
    icon: 'xbox', badge: 'New', available: true, rating: 4.7,
  },
  {
    id: 'playstation-plus', name: 'PlayStation Plus', category: 'gaming',
    description: 'Online multiplayer. Monthly free games. Cloud storage.',
    price: { amount: 450, currency: 'BDT', display: '৳450' },
    icon: 'playstation', badge: null, available: true, rating: 4.6,
  },
  {
    id: 'steam-gift-card', name: 'Steam Gift Card', category: 'gaming',
    description: 'Add funds to your Steam wallet. Buy any game.',
    price: { amount: 1000, currency: 'BDT', display: '৳1,000' },
    icon: 'steam', badge: null, available: true, rating: 4.8,
  },
  {
    id: 'apple-music', name: 'Apple Music', category: 'streaming',
    description: 'Lossless audio. Spatial Audio. 100M+ songs.',
    price: { amount: 280, currency: 'BDT', display: '৳280' },
    icon: 'applemusic', badge: null, available: true, rating: 4.5,
  },
  {
    id: 'grammarly-premium', name: 'Grammarly Premium', category: 'utility',
    description: 'Advanced grammar checks. Tone detection. Plagiarism.',
    price: { amount: 350, currency: 'BDT', display: '৳350' },
    icon: 'grammarly', badge: null, available: true, rating: 4.3,
  },
  {
    id: 'chatgpt-plus', name: 'ChatGPT Plus', category: 'utility',
    description: 'GPT-4 access. Faster responses. Priority access.',
    price: { amount: 1500, currency: 'BDT', display: '৳1,500' },
    icon: 'chatgpt', badge: 'Popular', available: true, rating: 4.9,
  }
];

// Initialize localStorage if not present
if (!localStorage.getItem('bonded_products')) {
  localStorage.setItem('bonded_products', JSON.stringify(window.DEFAULT_PRODUCTS));
}

// Add mock reviews dynamically to make the site look active
const mockReviewNames = ["Alex M.", "Sarah K.", "David T.", "Emily R.", "Michael C."];
const mockReviewTexts = [
  "Absolutely amazing! Delivery was instant and the code worked perfectly. Will definitely buy again.",
  "Super smooth transaction. Was a bit skeptical at first but everything went through without a hitch.",
  "Great price and fast delivery. Support team is also very responsive.",
  "Got my subscription within seconds. Highly recommended to anyone looking for hassle-free service.",
  "Perfect. 5/5 stars. Bonded Bazar is my go-to place for digital goods now."
];

window.DEFAULT_PRODUCTS.forEach(p => {
  p.reviews = [];
  const numReviews = Math.floor(Math.random() * 3) + 1; // 1 to 3 reviews
  
  for(let i=0; i<numReviews; i++) {
    p.reviews.push({
      id: Date.now() + Math.random().toString(36).substring(7),
      author: mockReviewNames[Math.floor(Math.random() * mockReviewNames.length)],
      rating: 5,
      comment: mockReviewTexts[Math.floor(Math.random() * mockReviewTexts.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  }
});

// Update the storage payload since we modified the default array
localStorage.setItem('bonded_products', JSON.stringify(window.DEFAULT_PRODUCTS));
