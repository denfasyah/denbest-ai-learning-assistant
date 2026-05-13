const Document = require("../models/Document");
const Workspace = require("../models/Workspace");
const AiConversation = require("../models/AiConversation");
const Flashcard = require("../models/Flashcard");
const Quiz = require("../models/Quiz");
const Summary = require("../models/Summary");
const Message = require("../models/Message");
const historyService = require("../services/historyService");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// Buat Workspace baru
exports.createWorkspace = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // Ambil user dari middleware auth

    const workspace = new Workspace({
      userId,
      title,
      description,
    });

    await workspace.save();

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// Upload Workspace + Document (Atomic)
exports.uploadWorkspaceAndDocument = async (req, res, next) => {
  let workspaceId = null;
  let documentId = null;
  let filePath = req.file ? req.file.path : null;

  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded",
      });
    }

    // 1. Cek duplikat berdasarkan nama file + userId
    const existingDocument = await Document.findOne({
      userId,
      originalName: req.file.originalname,
    });

    if (existingDocument) {
      const existingWorkspace = await Workspace.findById(existingDocument.workspaceId);
      if (existingWorkspace) {
        if (filePath) fs.unlinkSync(filePath);
        return res.status(409).json({
          success: false,
          message: "File with this name already exists in another workspace",
        });
      }
    }

    // 2. Buat Workspace
    const workspace = new Workspace({
      userId,
      title: title || req.file.originalname.split(".")[0],
      description: description || "",
    });
    await workspace.save();
    workspaceId = workspace._id;

    // 3. Persiapkan Document
    const fileType = path.extname(req.file.originalname).toLowerCase().replace(".", "");
    const document = new Document({
      workspaceId,
      userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType,
      sizeBytes: req.file.size,
      processingStatus: "processing",
    });

    // 4. Parse file
    let extractedText = "";
    if (fileType === "pdf") {
      try {
        const pdfBuffer = fs.readFileSync(req.file.path);
        const parsed = await pdfParse(pdfBuffer);
        extractedText = parsed.text;
      } catch (parseError) {
        // Cleanup on parse error
        await Workspace.findByIdAndDelete(workspaceId);
        if (filePath) fs.unlinkSync(filePath);
        return res.status(422).json({
          success: false,
          message: "Dokumen tidak bisa diproses. Pastikan PDF mengandung teks.",
        });
      }
    } else if (fileType === "txt" || fileType === "md") {
      extractedText = fs.readFileSync(req.file.path, "utf-8");
    }

    document.extractedText = extractedText;
    document.processingStatus = "completed";
    await document.save();
    documentId = document._id;

    // 5. Log activity
    await historyService.logActivity(
      userId,
      workspaceId,
      workspace.title,
      "document_uploaded",
      {
        documentId,
        fileName: document.originalName,
      },
    );

    res.status(201).json({
      success: true,
      message: "Workspace and document created successfully",
      data: {
        workspace,
        document,
      },
    });
  } catch (error) {
    // Global Cleanup
    if (workspaceId) await Workspace.findByIdAndDelete(workspaceId);
    if (documentId) await Document.findByIdAndDelete(documentId);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    next(error);
  }
};

// Toggle Favorite
exports.toggleFavorite = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user.id;

    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    workspace.isFavorite = !workspace.isFavorite;
    await workspace.save();

    res.status(200).json({
      success: true,
      message: `Workspace ${workspace.isFavorite ? "added to" : "removed from"} favorites`,
      data: workspace,
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
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Workspace.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: "Workspaces retrieved successfully",
      data: workspaces,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
      message: "Workspace retrieved successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// Update Workspace Title
exports.updateWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user.id;
    const { title } = req.body;

    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: "Workspace not found or unauthorized",
      });
    }

    const existingWorkspace = await Workspace.findOne({
      userId,
      title,
      _id: { $ne: workspaceId },
    });
    if (existingWorkspace) {
      return res.status(409).json({
        success: false,
        message: "Workspace with this title already exists",
      });
    }

    workspace.title = title;
    await workspace.save();

    // Synchronize document titles (originalName)
    // Assuming 1-to-1 or that user wants all documents in workspace to reflect the workspace name
    // The user mentioned "Prevent stale document titles"
    await Document.updateMany(
      { workspaceId },
      { $set: { originalName: title } }
    );

    await historyService.logActivity(
      userId,
      workspaceId,
      workspace.title,
      "workspace_renamed",
      { newTitle: title },
    );

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: workspace,
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

    // 1. Ambil info dokumen untuk hapus file fisik
    const documents = await Document.find({ workspaceId });
    for (const doc of documents) {
      const filePath = path.join(__dirname, "../../", doc.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 2. Cascade delete dari DB
    await Document.deleteMany({ workspaceId });
    await AiConversation.deleteMany({ workspaceId });
    await Flashcard.deleteMany({ workspaceId });
    await Quiz.deleteMany({ workspaceId });
    await Summary.deleteMany({ workspaceId });
    
    // Untuk Message, kita butuh conversationId. 
    // Tapi karena kita hapus workspace, kita bisa hapus message berdasarkan userId & workspaceId jika ada field itu, 
    // atau fetch conversationIds dulu.
    const convs = await AiConversation.find({ workspaceId });
    const convIds = convs.map(c => c._id);
    await Message.deleteMany({ conversationId: { $in: convIds } });

    // 3. Log SEBELUM dihapus supaya title masih ada
    await historyService.logActivity(
      userId,
      workspaceId,
      workspace.title,
      "workspace_deleted",
      { workspaceId },
    );

    // 4. Akhirnya hapus workspace
    await workspace.deleteOne();

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};



