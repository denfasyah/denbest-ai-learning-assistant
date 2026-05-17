const express = require('express');
const router = express.Router({ mergeParams: true });
const quizController = require('../controllers/quizController');

// POST /api/v1/workspaces/:workspaceId/quizzes
router.post('/', quizController.generateQuiz);

// GET /api/v1/workspaces/:workspaceId/quizzes
router.get('/', quizController.getQuizHistory);

// GET /api/v1/workspaces/:workspaceId/quizzes/:quizId
router.get('/:quizId', quizController.getQuizResult);

// POST /api/v1/workspaces/:workspaceId/quizzes/:quizId/submit
router.post('/:quizId/submit', quizController.submitQuiz);

module.exports = router;