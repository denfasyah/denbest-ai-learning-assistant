const Flashcard = require('../models/Flashcard');
const Document = require('../models/Document');
const Workspace = require('../models/Workspace');
const aiService = require('./aiService');
const historyService = require('./historyService');
const { buildFlashcardPrompt } = require('../utils/promptBuilder');

/**
 * Generate flashcards for a workspace
 */
const generateFlashcards = async (workspaceId, userId, count = 10) => {
  // 1. Check if flashcards already exist
  const existingCount = await Flashcard.countDocuments({ workspaceId });
  if (existingCount > 0) {
    return await Flashcard.find({ workspaceId }).sort({ createdAt: 1 });
  }

  // 2. Get document and workspace details
  const workspace = await Workspace.findOne({ _id: workspaceId, userId });
  if (!workspace) {
    const error = new Error('Workspace not found or unauthorized');
    error.status = 403;
    throw error;
  }

  const document = await Document.findOne({ workspaceId });
  if (!document || !document.extractedText) {
    const error = new Error('Document has no readable text to generate flashcards.');
    error.status = 422;
    throw error;
  }

  // 3. Build prompt
  const prompt = buildFlashcardPrompt(document.extractedText, count);

  // 4. Call AI service
  let responseText;
  try {
    responseText = await aiService.generateResponse(prompt, [], "Buat flashcard dari dokumen tersebut dalam format JSON array.");
  } catch (error) {
    if (error.message === 'TIMEOUT') {
      const timeoutErr = new Error('Flashcard generation timed out. Please try again.');
      timeoutErr.status = 504;
      throw timeoutErr;
    }
    throw error;
  }

  // 5. Parse JSON response AI
  let parsed;
  try {
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Retry 1x with stricter prompt
    const retryPrompt = buildFlashcardPrompt(document.extractedText, count) + 
      '\n\nPENTING: Response kamu sebelumnya bukan valid JSON. Kembalikan HANYA array JSON, dimulai dari "[" dan diakhiri "]". Tidak ada teks lain.';
    const retryResponse = await aiService.generateResponse(retryPrompt, [], "Kembalikan HANYA valid JSON array.");
    const retryCleaned = retryResponse.replace(/```json|```/g, '').trim();
    try {
      parsed = JSON.parse(retryCleaned);
    } catch (parseError) {
      const error = new Error('AI returned invalid format. Please try again.');
      error.status = 500;
      throw error;
    }
  }

  // 6. Validate parsed result
  if (!Array.isArray(parsed) || parsed.length === 0) {
    const error = new Error('AI returned invalid format. Please try again.');
    error.status = 500;
    throw error;
  }

  // 7. Bulk insert to DB
  const flashcardsToInsert = parsed.map(item => ({
    workspaceId,
    userId,
    frontText: item.front || item.frontText,
    backText: item.back || item.backText,
    difficulty: ['easy', 'medium', 'hard'].includes(item.difficulty) ? item.difficulty : 'medium',
    nextReviewDate: new Date(),
    reviewCount: 0,
  }));

  const inserted = await Flashcard.insertMany(flashcardsToInsert);

  // 8. Log history
  await historyService.logActivity(
    userId,
    workspaceId,
    workspace.title,
    'flashcard_generated',
    { count: inserted.length }
  );

  return inserted;
};

/**
 * Get flashcards by workspaceId
 */
const getFlashcards = async (workspaceId, userId) => {
  return await Flashcard.find({ workspaceId, userId }).sort({ nextReviewDate: 1, createdAt: 1 });
};

/**
 * Review/Rate a flashcard
 */
const reviewFlashcard = async (flashcardId, userId, rating) => {
  const flashcard = await Flashcard.findOne({ _id: flashcardId, userId });
  if (!flashcard) {
    const error = new Error('Flashcard not found');
    error.status = 404;
    throw error;
  }

  // SRS logic
  const now = new Date();
  const daysMap = { easy: 7, medium: 3, hard: 1 };
  const days = daysMap[rating] || 3;
  const nextReviewDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const updatedFlashcard = await Flashcard.findOneAndUpdate(
    { _id: flashcardId, userId },
    { 
      nextReviewDate, 
      $inc: { reviewCount: 1 }, 
      difficulty: rating 
    },
    { returnDocument: 'after' }
  );

  return updatedFlashcard;
};

/**
 * Force regenerate flashcards
 */
const regenerateFlashcards = async (workspaceId, userId, count = 10) => {
  await Flashcard.deleteMany({ workspaceId, userId });
  return await generateFlashcards(workspaceId, userId, count);
};

module.exports = {
  generateFlashcards,
  getFlashcards,
  reviewFlashcard,
  regenerateFlashcards
};
