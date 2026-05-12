const express = require("express");

const router = express.Router({ mergeParams: true });

const {
generateQuiz,
getQuizzes,
getQuizDetail,
submitQuiz,
} = require("../controllers/quizController");

router.post("/generate", generateQuiz);

router.get("/", getQuizzes);

router.get("/", getQuizDetail);

router.post("//submit", submitQuiz);

module.exports = router;