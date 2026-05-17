const summaryService = require('../services/summaryService');

/**
 * GET /workspaces/:workspaceId/summary
 */
const getSummary = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const summary = await summaryService.getSummary(workspaceId, userId);

    res.status(200).json({
      success: true,
      data: summary ? {
        content: summary.content,
        generatedAt: summary.generatedAt
      } : null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /workspaces/:workspaceId/summary/generate
 */
const generateSummary = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const summary = await summaryService.generateSummary(workspaceId, userId);

    res.status(200).json({
      success: true,
      data: {
        content: summary.content,
        generatedAt: summary.generatedAt
      }
    });
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'RATE_LIMIT' });
    }
    // Check if it's a known error status
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * POST /workspaces/:workspaceId/summary/regenerate
 */
const regenerateSummary = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    const summary = await summaryService.regenerateSummary(workspaceId, userId);

    res.status(200).json({
      success: true,
      data: {
        content: summary.content,
        generatedAt: summary.generatedAt
      }
    });
  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      return res.status(429).json({ success: false, message: 'RATE_LIMIT' });
    }
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getSummary,
  generateSummary,
  regenerateSummary
};