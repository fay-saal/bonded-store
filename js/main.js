const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000" : "https://bonded-bazar-api.onrender.com";

/* ============================================================
   BONDED STORE — Marketplace Data Layer & Interactions
   ============================================================ */

// ── SVG Icon Library ──────────────────────────────────────────
const ICONS = {
  // Product icons
  netflix: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`,
  canva: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>`,
  crunchyroll: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.909 13.436C2.914 7.61 7.642 2.893 13.468 2.898c5.576.005 10.137 4.339 10.51 9.819q.021-.351.022-.706C24.007 5.385 18.64.006 12.012 0S.007 5.36 0 11.988 5.36 23.994 11.988 24q.412 0 .815-.027c-5.526-.338-9.9-4.928-9.894-10.538Zm16.284.155a4.1 4.1 0 0 1-4.095-4.103 4.1 4.1 0 0 1 2.712-3.855 8.95 8.95 0 0 0-4.187-1.037 9.007 9.007 0 1 0 8.997 9.016q-.001-.847-.15-1.651a4.1 4.1 0 0 1-3.278 1.63Z"/></svg>`,
  xbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M6.5 6.5c1.5 2.5 3 5.5 5.5 9"/><path d="M17.5 6.5c-1.5 2.5-3 5.5-5.5 9"/></svg>`,
  playstation: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z"/></svg>`,
  steam: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>`,
  applemusic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  grammarly: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><path d="M9 15l2 2 4-4"/></svg>`,
  chatgpt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,

  // UI icons
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  cartSmall: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>`,

  // Social icons
  discordLogo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>`,

  // Trust icons
  lightning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>`,
  headset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  
  // MFS Payment Icons (Simple SVG representations)
  bkash: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 20l-10-5v-5l10 5 10-5v5l-10 5z"/></svg>`,
  nagad: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4-9a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 8h6l-3-6zm0 20l-3-6h6l-3 6zM4 12l6-3v6L4 12zm16 0l-6 3V9l6 3z"/></svg>`,
};


// ── Product Catalog ─────────────────────────────────────────────
let PRODUCTS = [];

// Category metadata
const CATEGORIES = [
  { slug: 'all', label: 'All Products' },
  { slug: 'streaming', label: 'Streaming' },
  { slug: 'gaming', label: 'Gaming' },
  { slug: 'social', label: 'Social' },
  { slug: 'utility', label: 'Utility' },
];


// ── State ─────────────────────────────────────────────────────
const state = {
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'popular',    // popular | price-asc | price-desc | newest
  checkedCategories: [], // sidebar checkboxes (empty = all)
  cartItems: JSON.parse(localStorage.getItem('bonded_cart')) || [], // Persist cart locally
  orders: JSON.parse(localStorage.getItem('bonded_orders')) || [], // Persist orders locally
  activeOrders: JSON.parse(localStorage.getItem('bonded_active_orders')) || [], // Active order IDs
  carouselIndex: 0,
  carouselTimer: null,
  currency: 'BDT', // BDT or USD
};

// ── Toasts & UI Helpers ───────────────────────────────────────
window.showToast = showToast;
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  const icon = type === 'success' 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="#ff4757" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fadeOut');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

function formatPrice(amountBdt) {
  if (state.currency === 'USD') {
    const usd = (amountBdt / 120).toFixed(2); // Mock conversion rate: 1 USD = 120 BDT
    return `$${usd}`;
  }
  return `৳${amountBdt.toLocaleString()}`;
}

// ── Star Rating Renderer ──────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  let html = '';
  for (let i = 0; i < full; i++) html += '<span class="star-filled">★</span>';
  if (hasHalf) html += '<span class="star-filled">★</span>'; // simplify half as full
  for (let i = 0; i < empty; i++) html += '<span class="star-empty">★</span>';
  return html;
}


// ── Product Card Renderer ─────────────────────────────────────
function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card reveal';
  
  // Remove badges for now as per user request
  const badgeHtml = '';

  let imageAreaHtml = '';
  if (product.base64Image) {
    imageAreaHtml = `<img src="${product.base64Image}" style="width:100%; height:100%; object-fit:cover; border-bottom: 1px solid var(--border);">`;
  } else {
    imageAreaHtml = `<div class="product-card__icon">${ICONS[product.icon]}</div>`;
  }

  card.innerHTML = `
    <div class="product-card__image-area">
      ${badgeHtml}
      ${imageAreaHtml}
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">${product.name}</h3>
      <div class="product-card__rating">
        ${renderStars(product.rating)}
        <span class="product-card__rating-num">${product.rating}</span>
      </div>
      <div class="product-card__price-row">
        <span class="product-card__price">${formatPrice(product.price.amount)}</span>
        <button class="btn-add-cart" aria-label="Add to cart" data-id="${product.id}">
          ${ICONS.cartSmall} Add
        </button>
      </div>
    </div>
    <!-- Hover Preview Popover -->
    <div class="product-preview-popover">
      <div class="popover-item">
        <svg class="popover-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Instant Delivery
      </div>
      <div class="popover-item">
        <svg class="popover-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        30-day Validity
      </div>
      <div class="popover-item">
        <svg class="popover-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        4.8/5 Rating
      </div>
    </div>
  `;

  // Quick Add listener
  card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  });

  // Navigate to product detail on card click
  card.addEventListener('click', () => {
    window.location.hash = `/product/${product.id}`;
  });

  return card;
}


// ── Cart ──────────────────────────────────────────────────────
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cartItems.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cartItems.push({ product, quantity: 1 });
  }

  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`${product.name} added to cart`, 'success');
  
  // Open cart automatically on desktop if added from grid
  if (window.innerWidth > 768) {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
  }
}

function saveCart() {
  localStorage.setItem('bonded_cart', JSON.stringify(state.cartItems));
  localStorage.setItem('bonded_active_orders', JSON.stringify(state.activeOrders || []));
}

function removeFromCart(productId) {
  state.cartItems = state.cartItems.filter(item => item.product.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const totalCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  }
}

async function renderCart() {
  const content = document.getElementById('cart-content');
  const emptyState = document.getElementById('cart-empty');
  const footer = document.getElementById('cart-footer');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const activeOrdersEl = document.getElementById('cart-active-orders');

  // Load and display active orders
  if (state.activeOrders && state.activeOrders.length > 0) {
    activeOrdersEl.style.display = 'block';
    
    // Check status of each order
    const updatedOrders = [];
    let ordersHtml = '<div style="background: rgba(45, 79, 255, 0.1); border: 1px solid rgba(45, 79, 255, 0.2); border-radius: 8px; padding: 12px;">';
    ordersHtml += '<h4 style="margin: 0 0 8px 0; font-size: 0.85rem; color: var(--accent-light);">Recent Orders</h4>';
    
    for (const orderId of state.activeOrders) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
        if (res.ok) {
          const orderData = await res.json();
          // If not delivered/rejected, keep it in active
          if (orderData.status !== 'Delivered' && orderData.status !== 'Rejected') {
            updatedOrders.push(orderId);
            ordersHtml += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.8rem;">
              <span>#${orderId}</span>
              <a href="#/order/${orderId}" onclick="document.getElementById('cart-close').click()" style="color: var(--accent-light); text-decoration: none;">Track</a>
            </div>`;
          }
        }
      } catch (e) {
        // network error, keep it for now
        updatedOrders.push(orderId);
      }
    }
    
    ordersHtml += '</div>';
    
    if (updatedOrders.length > 0) {
      activeOrdersEl.innerHTML = ordersHtml;
    } else {
      activeOrdersEl.style.display = 'none';
    }
    
    // Update state if orders were removed
    if (updatedOrders.length !== state.activeOrders.length) {
      state.activeOrders = updatedOrders;
      saveCart();
    }
  } else {
    activeOrdersEl.style.display = 'none';
  }

  if (state.cartItems.length === 0) {
    content.style.display = 'none';
    footer.style.display = 'none';
    emptyState.style.display = 'flex';
    // If we have active orders, don't show empty icon, just show the orders
    if (state.activeOrders && state.activeOrders.length > 0) {
      emptyState.style.display = 'none';
    }
    return;
  }

  content.style.display = 'block';
  footer.style.display = 'block';
  emptyState.style.display = 'none';

  let subtotal = 0;
  content.innerHTML = state.cartItems.map(item => {
    subtotal += item.product.price.amount * item.quantity;
    const iconHtml = item.product.base64Image ? `<img src="${item.product.base64Image}" style="width:100%;height:100%;object-fit:contain;border-radius:4px;">` : ICONS[item.product.icon];
    return `
      <div class="cart-item">
        <div class="cart-item__icon-wrap">${iconHtml}</div>
        <div class="cart-item__details">
          <div class="cart-item__name">${item.product.name}</div>
          <div class="cart-item__price">${formatPrice(item.product.price.amount * item.quantity)}</div>
          <div class="cart-item__actions">
            <div class="cart-item__qty">
              <button class="cart-item__qty-btn" onclick="changeQuantity('${item.product.id}', -1)">−</button>
              <input type="text" class="cart-item__qty-input" value="${item.quantity}" readonly>
              <button class="cart-item__qty-btn" onclick="changeQuantity('${item.product.id}', 1)">+</button>
            </div>
            <button class="cart-item__remove" onclick="removeFromCart('${item.product.id}')">
              ${ICONS.trash} Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const displayTotal = formatPrice(subtotal);
  subtotalEl.textContent = displayTotal;
  totalEl.textContent = displayTotal;
}

function initCartDrawer() {
  const cartBtn = document.getElementById('nav-cart');
  const closeBtn = document.getElementById('cart-close');
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  const continueBtn = document.getElementById('cart-continue-btn');

  function openCart() {
    drawer.classList.add('open');
    overlay.classList.add('open');
  }

  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }

  cartBtn?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  continueBtn?.addEventListener('click', closeCart);
  
  // Checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  checkoutBtn?.addEventListener('click', () => {
    closeCart();
    window.location.hash = '#/checkout';
  });
  
  // Make these global for inline onclick handlers in renderCart

  window.removeFromCart = removeFromCart;
}


// ── Filtering & Sorting ───────────────────────────────────────
function getFilteredProducts() {
  let results = [...PRODUCTS];

  // Category filter (sidebar checkboxes take priority over catbar)
  if (state.checkedCategories.length > 0) {
    results = results.filter(p => state.checkedCategories.includes(p.category));
  } else if (state.activeCategory !== 'all') {
    results = results.filter(p => p.category === state.activeCategory);
  }

  // Search filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (state.sortBy) {
    case 'price-asc':  results.sort((a, b) => a.price.amount - b.price.amount); break;
    case 'price-desc': results.sort((a, b) => b.price.amount - a.price.amount); break;
    case 'newest':     results.reverse(); break;
    case 'popular':
    default:           results.sort((a, b) => b.rating - a.rating); break;
  }

  return results;
}


function renderProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('listing-count');
  if (!grid) return;

  grid.innerHTML = '';
  const filtered = getFilteredProducts();

  if (countEl) {
    countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${PRODUCTS.length}</strong> products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="listing__empty">No products match your filters.</div>';
    return;
  }

  filtered.forEach(product => grid.appendChild(renderProductCard(product)));
  observeRevealElements();
}


// ── Category Bar ──────────────────────────────────────────────
function initCategoryBar() {
  document.querySelectorAll('.catbar__pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.catbar__pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeCategory = pill.dataset.category;
      // Sync sidebar checkboxes
      state.checkedCategories = [];
      document.querySelectorAll('.sidebar__checkbox input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      renderProducts();
    });
  });
}


// ── Sidebar Filters ───────────────────────────────────────────
function initSidebarFilters() {
  // Category checkboxes
  document.querySelectorAll('.sidebar__checkbox input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      state.checkedCategories = [];
      document.querySelectorAll('.sidebar__checkbox input[type="checkbox"]:checked').forEach(checked => {
        state.checkedCategories.push(checked.value);
      });
      // Reset catbar to "All" when using sidebar
      document.querySelectorAll('.catbar__pill').forEach(p => p.classList.remove('active'));
      document.querySelector('.catbar__pill[data-category="all"]').classList.add('active');
      state.activeCategory = 'all';
      renderProducts();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sortBy = sortSelect.value;
      renderProducts();
    });
  }

  // Mobile toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}


// ── Search ────────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = searchInput.value.trim();
      renderProducts();
    }, 200);
  });
}


// ── Hero Carousel ─────────────────────────────────────────────
function initCarousel() {
  const slides = document.querySelectorAll('.carousel__slide');
  const dots = document.querySelectorAll('.carousel__dot');
  if (slides.length === 0) return;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    state.carouselIndex = index;
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  function nextSlide() {
    goToSlide((state.carouselIndex + 1) % slides.length);
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoAdvance();
    });
  });

  // Auto-advance every 5s
  function resetAutoAdvance() {
    clearInterval(state.carouselTimer);
    state.carouselTimer = setInterval(nextSlide, 5000);
  }

  goToSlide(0);
  resetAutoAdvance();
}


// ── Scroll Reveal (Intersection Observer) ─────────────────────
let revealObserver = null;

function observeRevealElements() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}


// ── Sidebar category counts ──────────────────────────────────
function updateCategoryCounts() {
  CATEGORIES.forEach(cat => {
    if (cat.slug === 'all') return;
    const countEl = document.getElementById(`count-${cat.slug}`);
    if (countEl) {
      countEl.textContent = PRODUCTS.filter(p => p.category === cat.slug).length;
    }
  });
}


// ── Product Detail View (SPA) ─────────────────────────────────
function renderProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    window.location.hash = ''; // go home if not found
    return;
  }

  // Populate data
  const iconHtml = product.base64Image ? `<img src="${product.base64Image}" style="width:100%;height:100%;object-fit:contain;border-radius:16px;">` : ICONS[product.icon];
  document.getElementById('pd-icon').innerHTML = iconHtml;
  document.getElementById('pd-title').textContent = product.name;
  document.getElementById('pd-price').innerHTML = formatPrice(product.price.amount);
  document.getElementById('pd-desc').textContent = product.description;
  document.getElementById('pd-stars').innerHTML = renderStars(product.rating);
  document.getElementById('pd-rating-num').textContent = product.rating;
  
  const badgeEl = document.getElementById('pd-badge');
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.className = 'product-card__badge' + (product.badge === 'New' ? ' product-card__badge--new' : '');
    badgeEl.style.display = 'block';
  } else {
    badgeEl.style.display = 'none';
  }

  const stockEl = document.getElementById('pd-stock');
  if (product.available) {
    stockEl.textContent = 'In Stock';
    stockEl.style.color = 'var(--stock-green)';
  } else {
    stockEl.textContent = 'Out of Stock';
    stockEl.style.color = '#ff4757';
  }

  // Quantity handlers
  const qtyInput = document.getElementById('pd-qty-input');
  qtyInput.value = 1;
  const btnMinus = document.getElementById('pd-qty-minus');
  const btnPlus = document.getElementById('pd-qty-plus');
  
  // Clean up old listeners by cloning
  const newBtnMinus = btnMinus.cloneNode(true);
  const newBtnPlus = btnPlus.cloneNode(true);
  btnMinus.replaceWith(newBtnMinus);
  btnPlus.replaceWith(newBtnPlus);
  
  newBtnMinus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) qtyInput.value = val - 1;
  });
  newBtnPlus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    qtyInput.value = val + 1;
  });

  // Action Buttons
  const addCartBtn = document.getElementById('pd-add-cart');
  const newAddCartBtn = addCartBtn.cloneNode(true);
  addCartBtn.replaceWith(newAddCartBtn);
  
  newAddCartBtn.addEventListener('click', () => {
    const qty = parseInt(document.getElementById('pd-qty-input').value) || 1;
    addToCart(product.id, qty);
  });

  // Tabs
  document.querySelectorAll('.pd-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pd-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Back button
  document.getElementById('btn-back-home').addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back(); // Use history back to preserve scroll/filters if possible, or just change hash
    if (!window.location.hash) window.location.hash = ''; 
  });

  // Related Products
  const relatedGrid = document.getElementById('related-product-grid');
  relatedGrid.innerHTML = '';
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  related.forEach(p => {
    relatedGrid.appendChild(renderProductCard(p));
  });

  // Reviews
  renderReviews(product.id);
  setupReviewForm(product.id);

  // Scroll to top
  window.scrollTo(0, 0);
}

// ── Reviews Logic ───────────────────────────────────────────────
function renderReviews(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const listEl = document.getElementById('pd-reviews-list');
  if (!listEl || !product) return;
  
  listEl.innerHTML = '';
  const reviews = product.reviews || [];
  
  // Update header count
  const countLink = document.querySelector('.product-detail__reviews-link');
  if (countLink) countLink.textContent = `(${reviews.length} Reviews)`;

  if (reviews.length === 0) {
    listEl.innerHTML = '<div class="review-empty">No reviews yet. Be the first to review!</div>';
    return;
  }

  // Sort newest first based on generic date string (simple parse) or just reverse
  const sorted = [...reviews].reverse();

  sorted.forEach(rev => {
    const avatarChar = rev.author ? rev.author.charAt(0).toUpperCase() : 'A';
    
    // Generate stars HTML
    let starsHtml = '';
    for(let i=1; i<=5; i++) {
      if (i <= rev.rating) {
        starsHtml += '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      } else {
        starsHtml += '<svg viewBox="0 0 24 24" fill="var(--border)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
      }
    }

    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-item__header">
        <div class="review-item__author-info">
          <div class="review-item__avatar">${avatarChar}</div>
          <div>
            <span class="review-item__name">${rev.author}</span>
            <span class="review-item__date">${rev.date}</span>
          </div>
        </div>
        <div class="review-item__stars">${starsHtml}</div>
      </div>
      <div class="review-item__comment">${rev.comment}</div>
    `;
    listEl.appendChild(item);
  });
}

function setupReviewForm(productId) {
  const originalForm = document.getElementById('pd-review-form');
  if (!originalForm) return;

  // Clone form to remove all previous event listeners
  const form = originalForm.cloneNode(true);
  originalForm.replaceWith(form);

  const starContainer = form.querySelector('.star-rating-input');
  if (!starContainer) return;

  let currentRating = 5; // default
  const stars = Array.from(starContainer.querySelectorAll('svg'));

  const updateStars = (rating) => {
    stars.forEach(s => {
      if (parseInt(s.dataset.rating) <= rating) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  };

  // Setup interactive stars
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const hoverRating = parseInt(star.dataset.rating);
      stars.forEach(s => {
        if (parseInt(s.dataset.rating) <= hoverRating) s.classList.add('hovered');
        else s.classList.remove('hovered');
      });
    });
    
    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });
    
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.rating);
      updateStars(currentRating);
    });
  });

  // Initial star setup
  updateStars(currentRating);

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('review-name').value.trim();
    const textInput = document.getElementById('review-text').value.trim();
    
    if (!nameInput || !textInput) return;

    const payload = {
      author: nameInput,
      rating: currentRating,
      comment: textInput,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const updatedProduct = await res.json();

      // Update local PRODUCTS array with the updated product
      const idx = PRODUCTS.findIndex(p => p.id === productId);
      if (idx !== -1) {
        PRODUCTS[idx] = updatedProduct;
      }

      // Reset form and re-render
      form.reset();
      currentRating = 5;
      updateStars(currentRating);
      renderReviews(productId);

      if (window.showToast) {
        window.showToast('Review submitted successfully!');
      }
    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast('Failed to submit review', 'error');
    }
  });
}


// ── Checkout View (SPA) ───────────────────────────────────────
function renderCheckout() {
  if (state.cartItems.length === 0) {
    window.location.hash = ''; // Empty cart, redirect home
    return;
  }

  // Setup payment icons
  document.getElementById('icon-bkash').innerHTML = ICONS.bkash;
  document.getElementById('icon-nagad').innerHTML = ICONS.nagad;
  document.getElementById('icon-rocket').innerHTML = ICONS.rocket;

  // Calculate totals and render items
  let totalAmount = 0;
  const itemsHtml = state.cartItems.map(item => {
    const lineTotal = item.product.price.amount * item.quantity;
    totalAmount += lineTotal;
    return `
      <div class="summary-item-row">
        <span class="summary-item-name">${item.quantity}x ${item.product.name}</span>
        <span class="summary-item-price">৳${lineTotal.toLocaleString()}</span>
      </div>
    `;
  }).join('');

  document.getElementById('co-items').innerHTML = itemsHtml;
  document.getElementById('co-subtotal').textContent = `৳${totalAmount.toLocaleString()}`;
  document.getElementById('co-total').textContent = `৳${totalAmount.toLocaleString()}`;

  const methodDetails = {
    bkash: { name: 'bKash Personal', number: '01855641374' },
    nagad: { name: 'Nagad Personal', number: '01855641374' },
    rocket: { name: 'Rocket Personal', number: '01855641374' }
  };

  // Use a shared ref object so both the card listeners and order button see the same value
  const checkout = { selectedMethod: 'bkash' };

  const instructions = document.getElementById('payment-instructions');

  function updateInstructions(method) {
    const d = methodDetails[method];
    instructions.innerHTML = `<p>Send <strong class="text-accent">৳${totalAmount.toLocaleString()}</strong> to ${d.name} number: <strong class="text-white">${d.number}</strong> and enter the Transaction ID below.</p>`;
  }

  // Show default immediately
  updateInstructions('bkash');

  // Payment card listeners — clone to remove stale listeners
  document.querySelectorAll('.payment-card').forEach(card => {
    const fresh = card.cloneNode(true);
    card.replaceWith(fresh);
    fresh.addEventListener('click', () => {
      document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
      fresh.classList.add('active');
      checkout.selectedMethod = fresh.dataset.method;
      updateInstructions(checkout.selectedMethod);
    });
  });

  // Set bKash as default active
  const bkashCard = document.querySelector('.payment-card[data-method="bkash"]');
  if (bkashCard) bkashCard.classList.add('active');

  // Place Order button — clone to remove stale listeners
  const placeOrderBtn = document.getElementById('btn-place-order');
  const freshBtn = placeOrderBtn.cloneNode(true);
  placeOrderBtn.replaceWith(freshBtn);

  freshBtn.addEventListener('click', async () => {
    const nameEl = document.getElementById('co-name');
    const emailEl = document.getElementById('co-email');
    const contactEl = document.getElementById('co-contact');
    const senderEl = document.getElementById('co-sender');
    const trxidEl = document.getElementById('co-trxid');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const contact = contactEl.value.trim();
    const sender = senderEl.value.trim();
    const trxid = trxidEl.value.trim();

    // Reset border styles
    [nameEl, emailEl, contactEl, senderEl, trxidEl].forEach(el => el.style.borderColor = '');

    if (!name || !email || !contact || !sender || !trxid) {
      if (!name) nameEl.style.borderColor = '#ff4757';
      if (!email) emailEl.style.borderColor = '#ff4757';
      if (!contact) contactEl.style.borderColor = '#ff4757';
      if (!sender) senderEl.style.borderColor = '#ff4757';
      if (!trxid) trxidEl.style.borderColor = '#ff4757';
      showToast('Please fill in all highlighted fields.', 'error');
      const firstEmpty = [nameEl, emailEl, contactEl, senderEl, trxidEl].find(el => !el.value.trim());
      if (firstEmpty) firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailEl.style.borderColor = '#ff4757';
      showToast('Please enter a valid Gmail address.', 'error');
      emailEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const payload = {
      cart: state.cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        qty: item.quantity
      })),
      customerName: name,
      customerEmail: email,
      paymentMethod: checkout.selectedMethod,
      paymentSender: sender,
      paymentTrx: trxid
    };

    const originalText = freshBtn.textContent;
    freshBtn.textContent = 'Processing...';
    freshBtn.disabled = true;

    try {
      const res = await fetch('${API_BASE_URL}/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const newOrder = await res.json();

      if (!newOrder || !newOrder.id) {
        throw new Error('Invalid response from server. Please try again.');
      }

      // Save order to active orders
      state.activeOrders = state.activeOrders || [];
      state.activeOrders.push(newOrder.id);

      // Clear cart
      state.cartItems = [];
      saveCart();
      updateCartBadge();

      freshBtn.textContent = originalText;
      freshBtn.disabled = false;
      showToast('Order placed successfully! 🎉');
      window.location.hash = `#/order/${newOrder.id}`;

    } catch (err) {
      console.error('Order placement error:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
      freshBtn.textContent = originalText;
      freshBtn.disabled = false;
    }
  });

  window.scrollTo(0, 0);
}


// ── Order Confirmation View (SPA) ─────────────────────────────
async function renderOrder(orderId) {
  let order;
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    if (!res.ok) throw new Error("Not found");
    order = await res.json();
  } catch (err) {
    window.location.hash = ''; // not found
    return;
  }

  document.getElementById('ov-id').textContent = order.id;
  document.getElementById('ov-date').textContent = order.date;
  
  const statusEl = document.getElementById('ov-status');
  const noticeEl = document.getElementById('ov-notice');
  const codesSec = document.getElementById('ov-codes-section');
  const codesList = document.getElementById('ov-codes-list');

  // Reset classes
  statusEl.className = 'order-status';

  if (order.status.toLowerCase() === 'pending') {
    statusEl.textContent = 'Pending Verification';
    statusEl.classList.add('badge-pending');
    noticeEl.style.display = 'block';
    codesSec.style.display = 'none';
  } else if (order.status.toLowerCase() === 'verified') {
    statusEl.textContent = 'Verified';
    statusEl.classList.add('badge-verified');
    noticeEl.style.display = 'block';
    noticeEl.textContent = 'Payment verified! Your codes are being generated...';
    codesSec.style.display = 'none';
  } else if (order.status.toLowerCase() === 'delivered') {
    statusEl.textContent = 'Delivered';
    statusEl.classList.add('badge-delivered');
    noticeEl.style.display = 'none';
    codesSec.style.display = 'block';
  } else if (order.status.toLowerCase() === 'rejected') {
    statusEl.textContent = 'Rejected';
    statusEl.classList.add('badge-rejected');
    noticeEl.style.display = 'block';
    noticeEl.textContent = 'Your order was rejected. Please contact support.';
    codesSec.style.display = 'none';
  }

  if (order.status.toLowerCase() === 'delivered') {
    codesList.innerHTML = (order.deliveredCodes || []).map(mc => `
      <div class="gift-code-box">
        <div>
          <div class="text-secondary" style="font-size:0.85rem;margin-bottom:4px">${mc.productName}</div>
          <div class="code-value">${mc.code}</div>
        </div>
        <button class="btn--secondary btn--small" onclick="navigator.clipboard.writeText('${mc.code}'); window.showToast('Code copied to clipboard!', 'success');">Copy Code</button>
      </div>
    `).join('');
  }

  // Items
  if (order.items && Array.isArray(order.items)) {
    document.getElementById('ov-items').innerHTML = order.items.map(item => `
      <div class="order-item-row">
        <span>${item.qty || item.quantity || 1}x ${item.name || (item.product && item.product.name) || 'Product'}</span>
        <span>${formatPrice((item.price?.amount || 0) * (item.qty || item.quantity || 1))}</span>
      </div>
    `).join('');
  }
  
  document.getElementById('ov-total').textContent = formatPrice(order.total || 0);

  // Payment
  if (order.payment) {
    document.getElementById('ov-pay-method').textContent = (order.payment.method || 'N/A').toUpperCase();
    document.getElementById('ov-pay-sender').textContent = order.payment.sender || 'N/A';
    document.getElementById('ov-pay-trx').textContent = order.payment.trx || order.payment.trxid || 'N/A';
  } else {
    document.getElementById('ov-pay-method').textContent = 'N/A';
    document.getElementById('ov-pay-sender').textContent = 'N/A';
    document.getElementById('ov-pay-trx').textContent = 'N/A';
  }

  // Initialize Chat
  initOrderChat(order.id, order.status);

  window.scrollTo(0, 0);
}


// ── My Orders View ──────────────────────────────────────────────
async function renderMyOrdersView() {
  const btn = document.getElementById('btn-track-order');
  const input = document.getElementById('track-order-id');
  const errorEl = document.getElementById('track-error');
  const listEl = document.getElementById('my-orders-list');
  
  // Clone to remove old listeners
  const newBtn = btn.cloneNode(true);
  btn.replaceWith(newBtn);
  
  newBtn.addEventListener('click', async () => {
    const val = input.value.trim().toUpperCase();
    if (!val) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${val}`);
      if (res.ok) {
        errorEl.style.display = 'none';
        window.location.hash = `#/order/${val}`;
      } else {
        errorEl.style.display = 'block';
      }
    } catch (err) {
      errorEl.style.display = 'block';
    }
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') newBtn.click();
  });
  
  // Load saved orders
  if (!state.activeOrders || state.activeOrders.length === 0) {
    listEl.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.95rem;">No recent orders found on this device.</p>';
  } else {
    listEl.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Loading your orders...</p>';
    try {
      const orderPromises = state.activeOrders.map(id => fetch(`${API_BASE_URL}/api/orders/${id}`).then(r => r.ok ? r.json() : null));
      const orders = await Promise.all(orderPromises);
      
      const validOrders = orders.filter(o => o !== null);
      // Sort newest first based on ID or date string (fallback simple sort)
      validOrders.reverse();
      
      if (validOrders.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.95rem;">No recent orders found on this device.</p>';
      } else {
        listEl.innerHTML = validOrders.map(o => {
          let statusClass = 'badge-pending';
          let statusText = 'Pending';
          if (o.status.toLowerCase() === 'verified') { statusClass = 'badge-verified'; statusText = 'Verified'; }
          else if (o.status.toLowerCase() === 'delivered') { statusClass = 'badge-delivered'; statusText = 'Delivered'; }
          else if (o.status.toLowerCase() === 'rejected') { statusClass = 'badge-danger'; statusText = 'Rejected'; }
          
          return `
            <a href="#/order/${o.id}" class="my-order-card">
              <div class="my-order-card-info">
                <span class="my-order-id">${o.id}</span>
                <span class="my-order-date">${o.date}</span>
              </div>
              <div class="my-order-status-wrap">
                <span class="order-status ${statusClass}" style="font-size:0.75rem; padding:4px 8px;">${statusText}</span>
                <span class="my-order-total">${formatPrice(o.total)}</span>
              </div>
            </a>
          `;
        }).join('');
      }
    } catch (err) {
      listEl.innerHTML = '<p style="text-align:center; color:var(--text-danger);">Failed to load orders.</p>';
    }
  }

  window.scrollTo(0, 0);
}


// ── Router ────────────────────────────────────────────────────
function handleRouting() {
  const hash = window.location.hash;
  const homeView = document.getElementById('home-view');
  const productView = document.getElementById('product-detail-view');
  const checkoutView = document.getElementById('checkout-view');
  const orderView = document.getElementById('order-view');
  const myOrdersView = document.getElementById('my-orders-view');

  // Hide all by default
  homeView.style.display = 'none';
  productView.style.display = 'none';
  checkoutView.style.display = 'none';
  orderView.style.display = 'none';
  myOrdersView.style.display = 'none';

  if (hash.startsWith('#/product/')) {
    const productId = hash.replace('#/product/', '');
    productView.style.display = 'block';
    renderProductDetail(productId);
  } else if (hash === '#/checkout') {
    checkoutView.style.display = 'block';
    renderCheckout();
  } else if (hash.startsWith('#/order/')) {
    const orderId = hash.replace('#/order/', '');
    orderView.style.display = 'block';
    renderOrder(orderId);
  } else if (hash === '#/my-orders') {
    myOrdersView.style.display = 'block';
    renderMyOrdersView();
  } else {
    homeView.style.display = 'block';
  }
}

window.addEventListener('hashchange', handleRouting);


// ── Initialize ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Setup Currency Toggle
  document.getElementById('currency-toggle').addEventListener('change', (e) => {
    state.currency = e.target.value;
    // Re-render everything that shows prices
    renderProducts();
    renderCart();
    if (window.location.hash.startsWith('#/product/')) renderProductDetail(window.location.hash.replace('#/product/', ''));
    if (window.location.hash === '#/checkout') renderCheckout();
    if (window.location.hash.startsWith('#/order/')) renderOrder(window.location.hash.replace('#/order/', ''));
  });

  try {
    const res = await fetch('${API_BASE_URL}/api/products');
    PRODUCTS = await res.json();
  } catch (err) {
    console.error("Failed to fetch products", err);
    showToast("Error loading products. Is the server running?", "error");
  }

  renderProducts();
  initCategoryBar();
  initSidebarFilters();
  initSearch();
  initCarousel();
  updateCategoryCounts();
  observeRevealElements();
  
  // Cart & Routing Init
  initCartDrawer();
  updateCartBadge();
  renderCart();
  handleRouting();
});

window.changeQuantity = function(productId, delta) {
  const item = state.cartItems.find(i => i.product.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

// ── CHAT LOGIC (CUSTOMER) ────────────────────────────────────
let chatPollInterval = null;

function stopChatPolling() {
  if (chatPollInterval) {
    clearInterval(chatPollInterval);
    chatPollInterval = null;
  }
}

async function initOrderChat(orderId, orderStatus) {
  stopChatPolling();
  
  const chatSection = document.getElementById('ov-chat-section');
  const chatScrollPrompt = document.getElementById('chat-scroll-prompt');
  
  // Show chat for Pending, Verified, Delivered. Only hide if Rejected.
  if (orderStatus.toLowerCase() !== 'rejected') {
    chatSection.style.display = 'flex';
    if(chatScrollPrompt) chatScrollPrompt.style.display = 'flex';
  } else {
    chatSection.style.display = 'none';
    if(chatScrollPrompt) chatScrollPrompt.style.display = 'none';
    return;
  }

  const messagesContainer = document.getElementById('ov-chat-messages');
  const txtInput = document.getElementById('chat-text-input');
  const fileInput = document.getElementById('chat-image-input');
  const btnAttach = document.getElementById('btn-chat-attach');
  const btnSend = document.getElementById('btn-chat-send');
  const previewDiv = document.getElementById('chat-image-preview');
  const previewImg = document.getElementById('chat-preview-img');
  const btnRemovePreview = document.getElementById('btn-chat-preview-remove');

  // Load initial messages
  await fetchChatMessages(orderId);

  // Setup polling
  chatPollInterval = setInterval(() => fetchChatMessages(orderId), 5000);

  // Event Listeners (ensure we don't bind multiple times, use cloneNode hack for simplicity)
  const newBtnSend = btnSend.cloneNode(true);
  btnSend.replaceWith(newBtnSend);
  
  const newBtnAttach = btnAttach.cloneNode(true);
  btnAttach.replaceWith(newBtnAttach);
  
  const newFileInput = fileInput.cloneNode(true);
  fileInput.replaceWith(newFileInput);

  const newRemovePreview = btnRemovePreview.cloneNode(true);
  btnRemovePreview.replaceWith(newRemovePreview);
  
  const newTxtInput = txtInput.cloneNode(true);
  txtInput.replaceWith(newTxtInput);

  newBtnAttach.addEventListener('click', () => newFileInput.click());
  
  newFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      previewImg.src = URL.createObjectURL(file);
      previewDiv.style.display = 'flex';
    }
  });

  newRemovePreview.addEventListener('click', () => {
    newFileInput.value = '';
    previewDiv.style.display = 'none';
    previewImg.src = '';
  });

  newBtnSend.addEventListener('click', () => sendChatMessage(orderId, newTxtInput, newFileInput, previewDiv));
  newTxtInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage(orderId, newTxtInput, newFileInput, previewDiv);
  });
}

async function fetchChatMessages(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/messages`);
    if (!res.ok) return;
    const messages = await res.json();
    renderChatMessages(messages);
  } catch (err) {
    console.error('Chat fetch error:', err);
  }
}

function renderChatMessages(messages) {
  const container = document.getElementById('ov-chat-messages');
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.9rem; margin-top:20px;">No messages yet. Say hello!</p>`;
    return;
  }

  // Check if we are scrolled to bottom to auto-scroll later
  const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;

  container.innerHTML = messages.map(m => {
    const time = new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let imgHtml = '';
    if (m.imageUrl) {
      imgHtml = `<a href="${m.imageUrl}" target="_blank"><img src="${m.imageUrl}" class="chat-img-attachment" alt="attachment"></a>`;
    }
    return `
      <div class="chat-message ${m.sender === 'customer' ? 'customer' : 'admin'}">
        <div class="chat-bubble">
          ${m.text ? `<div>${m.text}</div>` : ''}
          ${imgHtml}
        </div>
        <div class="chat-time">${time}</div>
      </div>
    `;
  }).join('');

  if (isScrolledToBottom) {
    container.scrollTop = container.scrollHeight;
  }
}

async function sendChatMessage(orderId, txtInput, fileInput, previewDiv) {
  const text = txtInput.value.trim();
  const file = fileInput.files[0];

  if (!text && !file) return;

  const btnSend = document.getElementById('btn-chat-send');
  btnSend.textContent = '...';
  btnSend.disabled = true;

  const formData = new FormData();
  formData.append('sender', 'customer');
  if (text) formData.append('text', text);
  if (file) formData.append('image', file);

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/messages`, {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      txtInput.value = '';
      fileInput.value = '';
      previewDiv.style.display = 'none';
      await fetchChatMessages(orderId);
      const container = document.getElementById('ov-chat-messages');
      container.scrollTop = container.scrollHeight;
    }
  } catch (err) {
    window.showToast('Failed to send message', 'error');
  } finally {
    btnSend.textContent = 'Send';
    btnSend.disabled = false;
  }
}

// ── Developer Quote Typewriter Effect ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const quoteEl = document.getElementById('typing-quote');
  const authorEl = document.querySelector('.quote-author');
  if (!quoteEl) return;

  const quoteText = '"Be happy with your own reason"';
  let i = 0;
  let isTyping = false;

  function typeWriter() {
    if (i < quoteText.length) {
      quoteEl.innerHTML += quoteText.charAt(i);
      i++;
      // Randomize typing speed a bit for human feel (50ms to 120ms)
      setTimeout(typeWriter, Math.random() * 70 + 50);
    } else {
      // Done typing, reveal author
      setTimeout(() => {
        authorEl.classList.add('visible');
      }, 500);
    }
  }

  // Use IntersectionObserver to start typing only when it scrolls into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isTyping) {
        isTyping = true;
        // Start typing after a short delay
        setTimeout(typeWriter, 400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.querySelector('.developer-quote-section'));
});
