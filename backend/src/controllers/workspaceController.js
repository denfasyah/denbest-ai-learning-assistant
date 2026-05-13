const Document = require("../models/Document"); // ← tambah kalau belum ada
const Workspace = require("../models/Workspace");
const historyService = require("../services/historyService");

// Buat Workspace baru
exports.createWorkspace = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // Ambil user dari middleware auth

    const workspace = new Workspace({
      userId,
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await workspace.save();

    res.status(201).json({
      success: true,
      data: workspace,
      message: "Workspace created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// List Workspace user (paginated)
exports.getUserWorkspaces = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const workspaces = await Workspace.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Workspace.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: workspaces,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      message: "Workspaces retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Detail Workspace
exports.getWorkspaceDetail = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user.id;

    const workspace = await Workspace.findOne({ _id: workspaceId, userId });

    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: "Workspace not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      data: workspace,
      message: "Workspace retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Workspace Title
exports.updateWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.params.id; // ← pastikan ini 'id' bukan 'workspaceId'
    const userId = req.user.id;
    const { title } = req.body;

    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: "Workspace not found or unauthorized",
      });
    }

    workspace.title = title;
    workspace.updatedAt = new Date();
    await workspace.save();

    await historyService.logActivity(
      userId,
      workspaceId,
      workspace.title,
      "workspace_renamed",
      { newTitle: title },
    );

    res.status(200).json({
      success: true,
      data: workspace,
      message: "Workspace updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Workspace
exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user.id;

    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: "Workspace not found or unauthorized",
      });
    }

    await Document.deleteMany({ workspaceId });

    // ← log SEBELUM dihapus supaya title masih ada
    await historyService.logActivity(
      userId,
      workspaceId,
      workspace.title,
      "workspace_deleted",
      { workspaceId },
    );

    await workspace.deleteOne();

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};



