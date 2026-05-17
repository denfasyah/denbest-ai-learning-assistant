const Quiz = require('../models/Quiz');
const Document = require('../models/Document');
const Workspace = require('../models/Workspace');
const aiService = require('./aiService');
const historyService = require('./historyService');
const { buildQuizPrompt } = require('../utils/promptBuilder');

const parseQuizJson = (text) => {
  let cleanJson = text.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/```/g, '').trim();
  }

  try {
    return JSON.parse(cleanJson);
  } catch (err) {
    const match = cleanJson.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        throw new Error('Parse failed');
      }
    }
    throw new Error('Parse failed');
  }
};

const generateQuiz = async (workspaceId, userId, count = 5) => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId });
  if (!workspace) throw new Error('Workspace not found or unauthorized');

  const document = await Document.findOne({ workspaceId });
  if (!document || !document.extractedText || document.extractedText.trim() === '') {
    const err = new Error('Dokumen tidak memiliki teks yang bisa dibaca. Silakan upload ulang dokumen.');
    err.status = 422;
    throw err;
  }

  const prompt = buildQuizPrompt(document.extractedText, count);
  let questionsData = null;
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const aiResponse = await aiService.generateResponse(prompt, [], "Buat kuis berdasarkan dokumen ini.");
      questionsData = parseQuizJson(aiResponse);
      break;
    } catch (error) {
      if (error.message === 'RATE_LIMIT_EXCEEDED') throw error;
      if (attempt === 2) {
        const err = new Error('AI gagal menghasilkan format quiz yang valid. Coba lagi.');
        err.status = 500;
        throw err;
      }
    }
  }

  if (!Array.isArray(questionsData) || questionsData.length === 0) {
    const err = new Error('AI gagal menghasilkan format quiz yang valid. Coba lagi.');
    err.status = 500;
    throw err;
  }

  questionsData.forEach(q => {
    if (!q.options.includes(q.correctAnswer)) {
      const flexMatch = q.options.find(opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
      if (flexMatch) {
        q.correctAnswer = flexMatch;
      } else {
        const err = new Error('AI gagal menghasilkan format quiz yang valid. Coba lagi.');
        err.status = 500;
        throw err;
      }
    }
  });

  const quiz = await Quiz.create({
    workspaceId,
    userId,
    questions: questionsData,
    totalQuestions: questionsData.length,
    status: 'active'
  });

  const safeQuestions = quiz.questions.map(q => ({
    _id: q._id,
    question: q.question,
    options: q.options
  }));

  return {
    _id: quiz._id,
    workspaceId: quiz.workspaceId,
    totalQuestions: quiz.totalQuestions,
    status: quiz.status,
    questions: safeQuestions
  };
};

const submitQuiz = async (quizId, userId, answersArray) => {
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  
  if (!quiz) {
    const err = new Error('Quiz tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  
  if (quiz.status !== 'active') {
    return getQuizResult(quizId, userId);
  }

  let score = 0;
  const answersObj = {};

  const evaluatedQuestions = quiz.questions.map((q) => {
    const qId = String(q._id);
    const ans = answersArray.find(a => a.questionId === qId);
    const userAnswer = ans ? ans.selectedAnswer : null;
    
    if (userAnswer) {
      answersObj[qId] = userAnswer;
    }

    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) score += 1;

    return {
      _id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: userAnswer,
      isCorrect: isCorrect
    };
  });

  const finalScore = Math.round((score / quiz.totalQuestions) * 100);

  quiz.answers = answersObj;
  quiz.score = finalScore;
  quiz.status = 'completed';
  quiz.completedAt = new Date();
  await quiz.save();

  // ✅ Fix: pakai historyService dengan workspaceTitle snapshot + quizId di metadata
  try {
    const workspace = await Workspace.findById(quiz.workspaceId).select('title');
    await historyService.logActivity(
      userId,
      quiz.workspaceId,
      workspace?.title || 'Unknown Workspace',
      'quiz_completed',
      {
        score: score,
        totalQuestions: quiz.totalQuestions,
        quizId: quiz._id.toString()
      }
    );
  } catch (logError) {
    console.error('[HistoryLog] Failed to log quiz_completed:', logError.message);
  }

  return {
    score: score,
    totalQuestions: quiz.totalQuestions,
    percentage: finalScore,
    questions: evaluatedQuestions
  };
};

const getQuizResult = async (quizId, userId) => {
  const quiz = await Quiz.findOne({ _id: quizId, userId });
  if (!quiz) {
    const err = new Error('Quiz tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  if (quiz.status !== 'completed') {
    const err = new Error('Quiz belum di-submit.');
    err.status = 400;
    throw err;
  }
  
  let score = 0;
  const evaluatedQuestions = quiz.questions.map(q => {
    const userAnswer = quiz.answers[String(q._id)] || null;
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) score += 1;
    return {
      _id: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: userAnswer,
      isCorrect: isCorrect
    };
  });

  return {
    score: score,
    totalQuestions: quiz.totalQuestions,
    percentage: quiz.score,
    questions: evaluatedQuestions
  };
};

const getQuizHistory = async (workspaceId, userId) => {
  const quizzes = await Quiz.find({ workspaceId, userId }).sort({ createdAt: -1 });
  return quizzes;
};

module.exports = { generateQuiz, submitQuiz, getQuizResult, getQuizHistory };