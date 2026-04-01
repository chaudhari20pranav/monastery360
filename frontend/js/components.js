// ─── SHARED HTML COMPONENTS ───────────────────────────────────────────────────
// Inject navbar and footer into every page, then fire 'componentsReady'

const NAVBAR_HTML = `
<nav class="navbar" id="main-navbar">
  <div class="nav-inner">
    <a href="index.html" class="nav-brand">
      <span class="brand-icon">🏔️</span>
      <span>Monastery360</span>
    </a>

    <ul class="nav-menu" id="nav-menu">
      <li><a href="index.html"           class="nav-link">Home</a></li>
      <li><a href="monasteries.html"     class="nav-link">Monasteries</a></li>
      <li><a href="festivals.html"       class="nav-link">Festivals</a></li>
      <li><a href="scriptures.html"      class="nav-link">Scriptures</a></li>
      <li><a href="map.html"             class="nav-link">Map</a></li>
      <li><a href="booking.html"         class="nav-link">Book Visit</a></li>
    </ul>

    <div style="display:flex;align-items:center;gap:12px;">
      <div class="lang-selector">
        <button id="lang-btn" aria-label="Select language">🇬🇧 English</button>
        <div id="lang-dropdown" role="listbox" aria-label="Language options">
          <div class="lang-option" data-lang="en" role="option">🇬🇧 English</div>
          <div class="lang-option" data-lang="hi" role="option">🇮🇳 हिन्दी</div>
          <div class="lang-option" data-lang="ne" role="option">🇳🇵 नेपाली</div>
          <div class="lang-option" data-lang="bo" role="option">🏔️ བོད་སྐད་</div>
          <div class="lang-option" data-lang="zh" role="option">🇨🇳 普通话</div>
        </div>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
`;

const FOOTER_HTML = `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="brand-name">🏔️ Monastery360</div>
        <p>Explore the sacred Buddhist monasteries of Sikkim through immersive virtual tours, multilingual audio guides, and rich cultural storytelling.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
          <li><a href="monasteries.html">All Monasteries</a></li>
          <li><a href="festivals.html">Festivals</a></li>
          <li><a href="scriptures.html">Scriptures</a></li>
          <li><a href="map.html">Interactive Map</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Plan</h4>
        <ul>
          <li><a href="booking.html">Book a Visit</a></li>
          <li><a href="monasteries.html">Virtual Tours</a></li>
          <li><a href="festivals.html">Festival Calendar</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Monasteries</h4>
        <ul>
          <li><a href="monastery-detail.html?name=rumtek">Rumtek</a></li>
          <li><a href="monastery-detail.html?name=enchey">Enchey</a></li>
          <li><a href="monastery-detail.html?name=pemayangtse">Pemayangtse</a></li>
          <li><a href="monastery-detail.html?name=tashiding">Tashiding</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 Monastery360 · Celebrating Sikkim's Sacred Heritage</span>
      <span class="footer-om">ༀ མ་ཎི་པདྨེ་ཧཱུྃ</span>
    </div>
  </div>
</footer>
`;

// Inject components synchronously before DOM is fully parsed (script runs after placeholders)
function injectComponents() {
  const navPlaceholder    = document.getElementById('navbar-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (navPlaceholder) {
    navPlaceholder.outerHTML = NAVBAR_HTML;
  }
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = FOOTER_HTML;
  }

  // Signal that components are in the DOM
  document.dispatchEvent(new CustomEvent('componentsReady'));
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectComponents);
} else {
  injectComponents();
}