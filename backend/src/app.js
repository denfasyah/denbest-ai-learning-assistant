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

dotenv.config();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use(
  "/api/v1/workspaces",
  workspaceRoutes
);

app.use(
  "/api/v1/documents",
  documentRoutes
);

app.use(
  "/api/v1/history",
  historyRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/chat",
  chatRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/summary",
  summaryRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/flashcards",
  flashcardRoutes
);

app.use(
  "/api/v1/workspaces/:workspaceId/quizzes",
  quizRoutes
);

// Health Check
app.get('/api', (req, res) => {
  res.json({ message: 'AI Learning Assistant API is running' });
});

// 404 Handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
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
