// ─── SHARED UTILITIES ────────────────────────────────────────────────────────

// ── Language state ────────────────────────────────────────────────────────────
const LANGUAGES = {
  en: { name: 'English',  flag: '🇬🇧' },
  hi: { name: 'Hindi',    flag: '🇮🇳' },
  ne: { name: 'Nepali',   flag: '🇳🇵' },
  bo: { name: 'Tibetan',  flag: '🏔️'  },
  zh: { name: 'Mandarin', flag: '🇨🇳' },
};

// currentLang is module-level AND kept in sync with window so all pages can access it
let _currentLang = localStorage.getItem('m360_lang') || 'en';
if (!LANGUAGES[_currentLang]) _currentLang = 'en'; // guard against stale/invalid values

Object.defineProperty(window, 'currentLang', {
  get: () => _currentLang,
  set: (v) => { _currentLang = v; },
  configurable: true,
});

function setLang(code) {
  if (!LANGUAGES[code]) return;
  _currentLang = code;
  window.currentLang = code;
  localStorage.setItem('m360_lang', code);
  updateLangUI();
  document.dispatchEvent(new CustomEvent('langChange', { detail: code }));
}

function updateLangUI() {
  const btn = document.getElementById('lang-btn');
  if (btn) {
    const lang = LANGUAGES[_currentLang];
    btn.textContent = `${lang.flag} ${lang.name}`;
  }
}

// ── Translation helper ────────────────────────────────────────────────────────
function getTranslation(monastery, field) {
  if (monastery.translations && monastery.translations.length) {
    const t = monastery.translations.find(t => t.languageCode === _currentLang);
    if (t && t[field]) return t[field];
  }
  return monastery[field] || '';
}

// ── Toast notifications ───────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// ── Date formatter ────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ─── NAVBAR INIT ─────────────────────────────────────────────────────────────
function initNavbar() {
  // Mark active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop().split('?')[0];
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Language dropdown
  const langBtn      = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  if (langBtn && langDropdown) {
    updateLangUI(); // Set initial label from stored preference

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    langDropdown.querySelectorAll('.lang-option').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        setLang(item.dataset.lang);
        langDropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
      }
    });
  }

  // Scroll shadow
  const navbar = document.getElementById('main-navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
function initChatbot() {
  if (document.getElementById('chatbot-container')) return; // already added

  const container = document.createElement('div');
  container.id = 'chatbot-container';
  container.innerHTML = `
    <button id="chatbot-toggle" aria-label="Open monastery guide chat">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Ask Guide</span>
    </button>
    <div id="chatbot-window" class="chatbot-hidden" role="dialog" aria-label="Monastery Guide Chat">
      <div id="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">🏔️</div>
          <div>
            <div class="chatbot-title">Monastery Guide</div>
            <div id="chatbot-status-dot" class="chatbot-status-offline">Connecting…</div>
          </div>
        </div>
        <button id="chatbot-close" aria-label="Close chat">✕</button>
      </div>
      <div id="chatbot-messages" role="log" aria-live="polite">
        <div class="chatbot-msg chatbot-msg-assistant">
          Tashi Delek! 🙏 I'm your Monastery Guide. Ask me about Sikkim's sacred monasteries, festivals, history, or travel tips!
        </div>
      </div>
      <div id="chatbot-input-row">
        <input id="chatbot-input" type="text" placeholder="Ask about monasteries…" autocomplete="off" aria-label="Type your message"/>
        <button id="chatbot-send" aria-label="Send message">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const toggle   = document.getElementById('chatbot-toggle');
  const chatWin  = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn  = document.getElementById('chatbot-send');
  const input    = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const statusDot= document.getElementById('chatbot-status-dot');

  toggle.addEventListener('click', () => {
    const hidden = chatWin.classList.toggle('chatbot-hidden');
    if (!hidden) input.focus();
  });
  closeBtn.addEventListener('click', () => chatWin.classList.add('chatbot-hidden'));
  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) sendMsg(); });

  // Ping Ollama
  if (window.API) {
    window.API.chatPing()
      .then(() => {
        statusDot.textContent = '● Online';
        statusDot.className   = 'chatbot-status-online';
      })
      .catch(() => {
        statusDot.textContent = '● Ollama offline';
        statusDot.className   = 'chatbot-status-offline';
      });
  }

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `chatbot-msg chatbot-msg-${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendBtn.disabled = true;
    appendMsg('user', text);
    const thinking = appendMsg('assistant', '…');
    thinking.classList.add('chatbot-thinking');
    try {
      const data = await window.API.chat(text);
      thinking.remove();
      appendMsg('assistant', data.response || 'No response received.');
    } catch {
      thinking.remove();
      appendMsg('assistant', 'Could not reach the guide. Make sure Ollama is running locally.');
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
// Wait for components (navbar/footer) to be injected before initialising navbar
function boot() {
  initNavbar();
  initChatbot();
}

// components.js fires 'componentsReady' after injection
document.addEventListener('componentsReady', boot);

// Safety fallback: if components.js already ran (fast load) before this listener registered
if (document.getElementById('main-navbar')) {
  boot();
}

// ─── EXPORTS ─────────────────────────────────────────────────────────────────
window.LANGUAGES      = LANGUAGES;
window.setLang        = setLang;
window.getTranslation = getTranslation;
window.showToast      = showToast;
window.formatDate     = formatDate;