const Note = require('../models/Note');
const historyService = require('./historyService');

/**
 * Get user notes with optional search, filter, and pagination
 */
const getNotes = async (userId, { search, filter, page = 1, limit = 6 }) => {
  const query = { userId };

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [
      { title: regex },
      { content: regex },
      { tag: regex }
    ];
  }

  // Sort: pinned first (desc), then createdAt by filter (newest = -1, oldest = 1)
  const sortDirection = filter === 'oldest' ? 1 : -1;
  const sort = { pinned: -1, createdAt: sortDirection };

  const skip = (page - 1) * limit;
  const total = await Note.countDocuments(query);
  const notes = await Note.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

/**
 * Create a new note
 */
const createNote = async (userId, { title, content, tag, sourceType, sourceWorkspaceId, sourceWorkspaceTitle }) => {
  const note = new Note({
    userId,
    title,
    content,
    tag: tag || 'General',
    sourceType: sourceType || 'manual',
    sourceWorkspaceId: sourceWorkspaceId || null,
    sourceWorkspaceTitle: sourceWorkspaceTitle || null
  });

  const savedNote = await note.save();

  try {
    await historyService.logActivity(
      userId,
      null,                                          // workspaceId null (notes tidak terikat workspace)
      `Note: ${title}`,                              // workspaceTitle berisi judul note sebagai label
      'note_created',
      {
        noteId: savedNote._id.toString(),
        noteTitle: title,
        tag: tag || 'General',
        sourceType: sourceType || 'manual',
      }
    );
  } catch (logError) {
    console.error('[HistoryLog] Failed to log note_created:', logError.message);
  }

  return savedNote;
};

/**
 * Update an existing note
 */
const updateNote = async (noteId, userId, { title, content, tag }) => {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    const error = new Error('Note tidak ditemukan.');
    error.status = 404;
    throw error;
  }

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (tag !== undefined) note.tag = tag;

  return await note.save();
};

/**
 * Toggle the pinned status of a note
 */
const togglePin = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    const error = new Error('Note tidak ditemukan.');
    error.status = 404;
    throw error;
  }

  note.pinned = !note.pinned;
  return await note.save();
};

/**
 * Delete a note
 */
const deleteNote = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    const error = new Error('Note tidak ditemukan.');
    error.status = 404;
    throw error;
  }

  await note.deleteOne();
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  togglePin,
  deleteNote
};
