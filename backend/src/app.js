const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require("./routes/workspaceRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const historyRoutes = require("./routes/historyRoutes");
const {verifyToken} = require("./middlewares/authMiddleware");

dotenv.config();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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

// Centralized Error Handler (Standardized Format)
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
