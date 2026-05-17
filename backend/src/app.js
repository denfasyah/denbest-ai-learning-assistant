const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require("./routes/workspaceRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const historyRoutes = require("./routes/historyRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware verifikasi token query param untuk static files
const staticAuthMiddleware = (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ FIX: Mount static file serving for BOTH /uploads and /api/v1/uploads
// This ensures manual tests (direct root access) and frontend (API prefixed access) both work.
// It is mounted BEFORE any API routes and the 404 handler.
app.use(
  ['/uploads', '/api/v1/uploads'],
  staticAuthMiddleware,
  express.static(path.join(__dirname, '../uploads'))
);

// Routes
app.use('/api/v1/auth', authRoutes);

app.use(
  "/api/v1/workspaces",
  verifyToken,
  workspaceRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/documents",
  verifyToken,
  documentRoutes
);

app.use(
  "/api/v1/history",
  verifyToken,
  historyRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/chat",
  verifyToken,
  chatRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/summary",
  verifyToken,
  summaryRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/flashcards",
  verifyToken,
  flashcardRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/quizzes",
  verifyToken,
  quizRoutes
);

// Health Check
app.get('/api', (req, res) => {
  res.json({ message: 'AI Learning Assistant API is running' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Multer error handler
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File terlalu besar. Maksimal ukuran file adalah 10MB.",
    });
  }
  next(err);
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
