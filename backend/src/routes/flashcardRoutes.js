const express = require("express");

const router = express.Router({ mergeParams: true });

const {
generateFlashcards,
getFlashcards,
reviewFlashcard,
} = require("../controllers/flashcardController");

router.post("/generate", generateFlashcards);

router.get("/", getFlashcards);

router.patch(
"//review",
reviewFlashcard,
);

module.exports = router;