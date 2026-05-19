const History = require("../models/History");
const Workspace = require("../models/Workspace");
const Note = require('../models/Note');

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const { type, workspaceId } = req.query;

    // 1. Build query
    // 1. Build query
    const query = { userId };

    // Exclude workspace_created selalu
    const excludedTypes = [
      "workspace_created",
      "workspace_renamed",
      "workspace_deleted",
    ];

    if (type && type !== "all") {
      // Filter spesifik — tapi tetap exclude workspace_created
      if (!excludedTypes.includes(type)) {
        query.actionType = type;
      } else {
        // User filter sesuatu yang di-exclude — return kosong
        query.actionType = "__none__";
      }
    } else {
      // Semua aktivitas — kecuali yang di-exclude
      query.actionType = { $nin: excludedTypes };
    }

    // 2. Count total
    const total = await History.countDocuments(query);

    // 3. Fetch paginated
    const skip = (page - 1) * limit;
    const histories = await History.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 4. Soft history resolution (cek workspace masih exist, 1 query saja)
    const workspaceIds = [
      ...new Set(
        histories.map((h) => h.workspaceId?.toString()).filter(Boolean),
      ),
    ];

    const existingWorkspaces = await Workspace.find({
      _id: { $in: workspaceIds },
    }).select("_id title");

    const existingIds = new Set(
      existingWorkspaces.map((w) => w._id.toString()),
    );

    // Resolusi note_created: cek apakah note masih exist
    const noteHistories = histories.filter(
      h => h.actionType === 'note_created' && h.metadata?.noteId
    );
    const noteIds = noteHistories.map(h => h.metadata.noteId).filter(Boolean);

    let deletedNoteIds = new Set();
    if (noteIds.length > 0) {
      const existingNotes = await Note.find({ _id: { $in: noteIds } }).select('_id').lean();
      const existingNoteIds = new Set(existingNotes.map(n => n._id.toString()));
      // Yang tidak ada di existingNoteIds berarti sudah dihapus
      noteIds.forEach(id => {
        if (!existingNoteIds.has(id.toString())) {
          deletedNoteIds.add(id.toString());
        }
      });
    }

    // 5. Map response
    // Buat map workspaceId → title dari DB
    const workspaceTitleMap = {};
    existingWorkspaces.forEach((w) => {
      workspaceTitleMap[w._id.toString()] = w.title;
    });

    const data = histories.map((h) => {
      const wsId = h.workspaceId?.toString();
      const wsExists = wsId && existingIds.has(wsId);

      let metadata = h.metadata || {};

      // Jika note_created dan noteId sudah terhapus, flag noteDeleted
      if (
        h.actionType === 'note_created' &&
        metadata.noteId &&
        deletedNoteIds.has(metadata.noteId.toString())
      ) {
        metadata = { ...metadata, noteDeleted: true };
      }

      return {
        id: h._id,
        actionType: h.actionType,
        workspaceTitle: wsExists
          ? workspaceTitleMap[wsId] || h.workspaceTitle
          : h.workspaceTitle,
        workspaceId: wsExists ? h.workspaceId : null,
        metadata,
        createdAt: h.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
      error: error.message,
    });
  }
};
