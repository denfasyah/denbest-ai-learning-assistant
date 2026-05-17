const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  generateSummary,
  getSummary,
  regenerateSummary,
} = require("../controllers/summaryController");

// GET /api/v1/workspaces/:workspaceId/summary
router.get("/", getSummary);

// POST /api/v1/workspaces/:workspaceId/summary/generate
router.post("/generate", generateSummary);

// POST /api/v1/workspaces/:workspaceId/summary/regenerate
router.post("/regenerate", regenerateSummary);

module.exports = router;