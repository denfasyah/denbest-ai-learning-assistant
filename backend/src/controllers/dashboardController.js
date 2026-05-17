const Workspace = require('../models/Workspace');
const Document = require('../models/Document');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const Summary = require('../models/Summary');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalDocuments, totalFlashcards, totalQuizzes, totalSummaries, favoriteWorkspaces] = await Promise.all([
      Document.countDocuments({ userId }),
      Flashcard.countDocuments({ userId }),
      Quiz.countDocuments({ userId, status: 'completed' }),
      Summary.countDocuments({ workspaceId: { $in: await Workspace.find({ userId }).distinct('_id') } }),
      Workspace.find({ userId, isFavorite: true }).select('_id title').limit(5)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDocuments,
          totalFlashcards,
          totalQuizzes,
          totalSummaries,
        },
        favoriteWorkspaces
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};