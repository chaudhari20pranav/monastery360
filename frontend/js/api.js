// ─── API CLIENT ──────────────────────────────────────────────────────────────
// Detects environment automatically for deployment compatibility

const API = (() => {

  function getBaseUrl() {
    const { hostname, port } = window.location;

    // Case 1: Local frontend dev server (Live Server)
    if ((hostname === 'localhost' || hostname === '127.0.0.1') &&
        (port === '5500' || port === '5501')) {
      return 'http://localhost:5000/api';
    }

    // Case 2: Frontend deployed on Netlify
    if (hostname.includes('netlify.app')) {
      return 'https://monastery360-6slq.onrender.com/api';
    }

    // Case 3: Backend served together (same origin, e.g., Spring Boot)
    return '/api';
  }

  const BASE_URL = getBaseUrl();

  const request = async (endpoint, options = {}) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        credentials: 'include',
        ...options,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      return data;

    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  };

  return {
    // ── Config ────────────────────────────────────────────────────────────────
    getConfig: () => request('/config'),

    // ── Monasteries ───────────────────────────────────────────────────────────
    getMonasteries:    ()      => request('/monasteries'),
    getMonastery:      (id)    => request(`/monasteries/${id}`),
    searchMonasteries: (query) => request(`/monasteries/search/${encodeURIComponent(query)}`),

    // ── Festivals ─────────────────────────────────────────────────────────────
    getFestivals:        ()            => request('/festivals'),
    getFestivalsByYear:  (year)        => request(`/festivals/year/${year}`),
    getFestivalsByMonth: (year, month) => request(`/festivals/month/${year}/${month}`),

    // ── Bookings ──────────────────────────────────────────────────────────────
    createBooking: (payload) =>
      request('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),

    getBookings: () => request('/bookings'),

    // ── Scriptures ────────────────────────────────────────────────────────────
    getScriptures:    ()      => request('/scriptures'),
    searchScriptures: (query) => request(`/scriptures/search/${encodeURIComponent(query)}`),

    // ── Audio ─────────────────────────────────────────────────────────────────
    getAudioUrl: (monasteryId, lang) =>
      `${BASE_URL}/audio/monastery/${monasteryId}/language/${lang}`,

    // ── Chat ──────────────────────────────────────────────────────────────────
    chat: (message) =>
      request('/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      }),

    chatPing: () =>
      request('/chat', {
        method: 'POST',
        body: JSON.stringify({ check: true })
      }),

    // Debug
    BASE_URL,
  };

})();

// Make globally accessible
window.API = API;