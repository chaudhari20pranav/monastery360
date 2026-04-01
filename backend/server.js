require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/database');

connectDB();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// In development allow common local dev servers; in production allow the
// configured FRONTEND_URL plus same-origin requests (origin = undefined).
const allowedOrigins = (() => {
  const base = [
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  if (process.env.FRONTEND_URL) base.push(process.env.FRONTEND_URL);
  return base;
})();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, same-origin in prod)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In development be lenient
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods:      ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:  true,
}));

// ─── BODY PARSERS ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ─── STATIC: backend public files (audio) ────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── STATIC: serve frontend (always — single port for dev and prod) ──────────
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success:   true,
    message:   'Monastery360 API is running',
    timestamp: new Date(),
    env:       process.env.NODE_ENV || 'development',
  });
});

// ─── CONFIG ENDPOINT ─────────────────────────────────────────────────────────
app.get('/api/config', (req, res) => {
  res.json({
    emailjsKey:      process.env.EMAILJS_PUBLIC_KEY      || '',
    emailjsService:  process.env.EMAILJS_SERVICE_ID      || '',
    emailjsTemplate: process.env.EMAILJS_TEMPLATE_ID     || '',
  });
});

// ─── API ROUTES ──────────────────────────────────────────────────────────────
app.use('/api/monasteries', require('./routes/monasteryRoutes'));
app.use('/api/festivals',   require('./routes/festivalRoutes'));
app.use('/api/bookings',    require('./routes/bookingRoutes'));
app.use('/api/audio',       require('./routes/audioRoutes'));
app.use('/api/scriptures',  require('./routes/scriptureRoutes'));
app.use('/api/chat',        require('./routes/chatRoutes'));

// ─── SPA FALLBACK (all envs) ─────────────────────────────────────────────────
app.get('*', (req, res, next) => {
  // Only serve frontend for non-API routes
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
  }
  next();
});

// ─── CENTRAL ERROR HANDLER ───────────────────────────────────────────────────
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error:   process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Something went wrong'),
  });
});

// ─── START SERVER ────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT, 10) || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`   App:      http://localhost:${PORT}`);
  console.log(`   API:      http://localhost:${PORT}/api/health`);
});

// ─── GRACEFUL SHUTDOWN ───────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully…');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down…');
  server.close(() => process.exit(0));
});