# Monastery360 🏔️

Explore the sacred Buddhist monasteries of Sikkim through 360° virtual tours, multilingual audio guides, and an interactive map.

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ (check: `node --version`)
- MongoDB Atlas account (free tier works perfectly)

### 2. Configure Environment
Edit `backend/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/
EMAILJS_PUBLIC_KEY=your_key
EMAILJS_SERVICE_ID=your_service
EMAILJS_TEMPLATE_ID=your_template
OLLAMA_HOST=http://localhost:11434   # optional — for AI chat
```

### 3. Install & Seed
```bash
cd backend
npm install

# Seed the database (run once, or whenever you want to reset data)
node scripts/seedDatabase.js
```

### 4. Start the Server
```bash
npm start
# OR for auto-reload during development:
npm run dev
```

### 5. Open the App
Visit: **http://localhost:5000**

Everything runs on a single port — frontend and backend together.

---

## Features

| Feature | How it works |
|---|---|
| **360° Tours** | Google Street View embedded via iframe — click/drag to look around |
| **Audio Guides** | Browser Web Speech API (TTS) — 5 languages, no audio files needed |
| **Interactive Map** | Leaflet.js with CARTO dark tiles — all 6 monasteries pinned |
| **Festivals** | MongoDB — 2025 and 2026 dates pre-seeded |
| **Scriptures** | MongoDB — 10 detailed Buddhist texts |
| **Book Visit** | Form → MongoDB + optional EmailJS confirmation |
| **AI Chat** | Ollama (local LLM) — optional, shows offline gracefully |

## Adding Real Images

Place monastery photos in `frontend/assets/images/`:
- `rumtek.jpg`
- `enchey.jpg`
- `pemayangtse.jpg`
- `tashiding.jpg`
- `phodong.jpg`
- `dubdi.jpg`

Any standard JPG/PNG works. Missing images fall back to placeholder automatically.

## Project Structure
```
monastery360/
├── backend/
│   ├── config/         MongoDB connection
│   ├── controllers/    Route handlers
│   ├── models/         Mongoose schemas
│   ├── routes/         Express routers
│   ├── scripts/
│   │   └── seedDatabase.js   ← Run this to populate DB
│   └── server.js       Main server (serves both API + frontend)
└── frontend/
    ├── css/style.css
    ├── js/
    │   ├── api.js          API client
    │   ├── components.js   Navbar + footer injection
    │   └── main.js         Shared utilities + chatbot
    ├── index.html
    ├── monasteries.html
    ├── monastery-detail.html   ← 360° tour + Audio guide + Videos
    ├── festivals.html
    ├── scriptures.html
    ├── map.html
    └── booking.html
```
