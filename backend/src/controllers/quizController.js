const quizService = require('../services/quizService');

const generateQuiz = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;
    const { count } = req.body;
    const quiz = await quizService.generateQuiz(workspaceId, userId, count || 5);
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'RATE_LIMIT' });
    }
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body;
    const result = await quizService.submitQuiz(quizId, userId, answers);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getQuizResult = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const result = await quizService.getQuizResult(quizId, userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getQuizHistory = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;
    const history = await quizService.getQuizHistory(workspaceId, userId);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateQuiz, submitQuiz, getQuizResult, getQuizHistory };