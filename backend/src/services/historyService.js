const History = require('../models/History');

exports.logActivity = async (userId, workspaceId, workspaceTitle, actionType, metadata) => {
  const history = new History({
    userId,
    workspaceId: workspaceId || null, // Nullable jika di luar workspace
    workspaceTitle,
    actionType,
    metadata,
    createdAt: new Date(),
  });

  await history.save();
};