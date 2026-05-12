const express = require("express");

const router = express.Router({ mergeParams: true });

const {
generateSummary,
getSummary,
} = require("../controllers/summaryController");

router.post("/generate", generateSummary);

router.get("/", getSummary);

module.exports = router;