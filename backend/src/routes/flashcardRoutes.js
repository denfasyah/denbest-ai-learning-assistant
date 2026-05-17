const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams agar :workspaceId tersedia

const {
  generateFlashcards,
  getFlashcards,
  reviewFlashcard,
  regenerateFlashcards,
} = require("../controllers/flashcardController");

// Karena verifyToken sudah diterapkan di app.js pada level parent route /workspaces/:workspaceId/flashcards,
// kita tidak wajib menerapkannya lagi di sini, tapi untuk kejelasan kita bisa pakai jika mau.
// Namun mengikuti instruksi (ganti 501 placeholder):

router.get("/", getFlashcards);
router.post("/generate", generateFlashcards);
router.post("/regenerate", regenerateFlashcards);
router.patch("/:flashcardId/review", reviewFlashcard);

module.exports = router;