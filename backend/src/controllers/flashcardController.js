const flashcardService = require('../services/flashcardService');

/**
 * Generate flashcards controller
 */
const generateFlashcards = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;
    const count = parseInt(req.body.count) || 10;

    if (count < 5 || count > 20) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 5 and 20'
      });
    }

    const flashcards = await flashcardService.generateFlashcards(workspaceId, userId, count);

    res.status(200).json({
      success: true,
      data: flashcards,
      message: 'Flashcards generated successfully'
    });
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'RATE_LIMIT' });
    }
    next(error);
  }
};

/**
 * Get flashcards controller
 */
const getFlashcards = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const flashcards = await flashcardService.getFlashcards(workspaceId, userId);

    res.status(200).json({
      success: true,
      data: flashcards
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Review flashcard controller
 */
const reviewFlashcard = async (req, res, next) => {
  try {
    const { flashcardId } = req.params;
    const userId = req.user.id;
    const { rating } = req.body;

    if (!['easy', 'medium', 'hard'].includes(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be one of: easy, medium, hard'
      });
    }

    const updatedFlashcard = await flashcardService.reviewFlashcard(flashcardId, userId, rating);

    res.status(200).json({
      success: true,
      data: updatedFlashcard,
      message: 'Flashcard reviewed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Regenerate flashcards controller
 */
const regenerateFlashcards = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;
    const count = parseInt(req.body.count) || 10;

    if (count < 5 || count > 20) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 5 and 20'
      });
    }

    const flashcards = await flashcardService.regenerateFlashcards(workspaceId, userId, count);

    res.status(200).json({
      success: true,
      data: flashcards,
      message: 'Flashcards regenerated successfully'
    });
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'RATE_LIMIT' });
    }
    next(error);
  }
};

module.exports = {
  generateFlashcards,
  getFlashcards,
  reviewFlashcard,
  regenerateFlashcards
};