const noteService = require('../services/noteService');

exports.getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, filter, page, limit } = req.query;
    const result = await noteService.getNotes(userId, {
      search,
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 6,
    });
    return res.status(200).json({ success: true, data: result.notes, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, content, tag, sourceType, sourceWorkspaceId, sourceWorkspaceTitle } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title dan content wajib diisi.' });
    }
    const note = await noteService.createNote(userId, { title, content, tag, sourceType, sourceWorkspaceId, sourceWorkspaceTitle });
    return res.status(201).json({ success: true, data: note, message: 'Note berhasil dibuat.' });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    const { title, content, tag } = req.body;
    const note = await noteService.updateNote(noteId, userId, { title, content, tag });
    return res.status(200).json({ success: true, data: note, message: 'Note berhasil diupdate.' });
  } catch (error) {
    next(error);
  }
};

exports.togglePin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    const note = await noteService.togglePin(noteId, userId);
    return res.status(200).json({ success: true, data: note, message: `Note ${note.pinned ? 'pinned' : 'unpinned'}.` });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    await noteService.deleteNote(noteId, userId);
    return res.status(200).json({ success: true, data: null, message: 'Note berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};
