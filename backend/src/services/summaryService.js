const Summary = require('../models/Summary');
const Document = require('../models/Document');
const Workspace = require('../models/Workspace');
const aiService = require('./aiService');
const historyService = require('./historyService');
const { buildSummaryPrompt } = require('../utils/promptBuilder');

/**
 * Get summary by workspaceId
 */
const getSummary = async (workspaceId, userId) => {
  // Check workspace ownership
  const workspace = await Workspace.findOne({ _id: workspaceId, userId });
  if (!workspace) {
    throw new Error('Workspace not found or unauthorized');
  }

  const summary = await Summary.findOne({ workspaceId });
  return summary;
};

/**
 * Generate summary for a workspace
 */
const generateSummary = async (workspaceId, userId) => {
  // 1. Check if summary already exists
  let summary = await Summary.findOne({ workspaceId });
  if (summary) {
    return summary;
  }

  // 2. Check workspace ownership and get details
  const workspace = await Workspace.findOne({ _id: workspaceId, userId });
  if (!workspace) {
    const error = new Error('Workspace not found or unauthorized');
    error.status = 403;
    throw error;
  }

  // 3. Get document text
  const document = await Document.findOne({ workspaceId });
  if (!document || !document.extractedText) {
    const error = new Error('Document has no readable text to summarize.');
    error.status = 422;
    throw error;
  }

  // 4. Build prompt
  const prompt = buildSummaryPrompt(document.extractedText);

  // 5. Call AI service
  const aiResponse = await aiService.generateResponse(prompt, [], "Buat ringkasan komprehensif dari dokumen tersebut.");
  
  // 6. Save/Upsert summary
  summary = await Summary.findOneAndUpdate(
    { workspaceId },
    { 
      content: aiResponse, 
      generatedAt: new Date() 
    },
    { upsert: true, new: true }
  );

  // 7. Log to history
  await historyService.logActivity(
    userId,
    workspaceId,
    workspace.title,
    'summary_generated',
    {}
  );

  return summary;
};

/**
 * Force regenerate summary
 */
const regenerateSummary = async (workspaceId, userId) => {
  // Check workspace ownership
  const workspace = await Workspace.findOne({ _id: workspaceId, userId });
  if (!workspace) {
    const error = new Error('Workspace not found or unauthorized');
    error.status = 403;
    throw error;
  }

  // Delete existing summary
  await Summary.deleteOne({ workspaceId });

  // Call generateSummary (which will now create a new one)
  return await generateSummary(workspaceId, userId);
};

module.exports = {
  getSummary,
  generateSummary,
  regenerateSummary
};
