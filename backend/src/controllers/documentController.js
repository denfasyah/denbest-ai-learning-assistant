const Document = require("../models/Document");
const Workspace = require("../models/Workspace");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const historyService = require("../services/historyService");

// Upload dokumen ke workspace
exports.uploadDocument = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;

    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: "Workspace not found or unauthorized",
      });
    }

    // Pastikan file sudah ada di req.file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded",
      });
    }

    // Cek duplikat berdasarkan nama file + userId
    // Cek duplikat — hanya pada workspace yang masih aktif milik user ini
    const existingDocument = await Document.findOne({
      userId,
      originalName: req.file.originalname,
    });

    if (existingDocument) {
      // Cek apakah workspace-nya masih ada
      const existingWorkspace = await Workspace.findById(
        existingDocument.workspaceId,
      );

      if (existingWorkspace) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: false,
        });
      }
      // Kalau workspacenya sudah dihapus, lanjut upload normal
    }

    // Tentukan tipe file
    const fileType = path
      .extname(req.file.originalname)
      .toLowerCase()
      .replace(".", "");
    const document = new Document({
      workspaceId,
      userId,
      originalName: req.file.originalname,
      fileName: req.file.filename, // Nama unik yang disimpan
      fileUrl: `/uploads/${req.file.filename}`, // Bisa diakses via statik
      fileType,
      sizeBytes: req.file.size,
      processingStatus: "processing", // Awal processing
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Parse file untuk extract text
    let extractedText = "";
    if (fileType === "pdf") {
      try {
        const pdfBuffer = fs.readFileSync(req.file.path);
        const parsed = await pdfParse(pdfBuffer);
        extractedText = parsed.text;
      } catch (parseError) {
        document.processingStatus = "failed";
        await document.save();
        return res.status(422).json({
          success: false,
          message: "Dokumen tidak bisa dibaca. Pastikan PDF mengandung teks.",
        });
      }
    } else if (fileType === "txt" || fileType === "md") {
      extractedText = fs.readFileSync(req.file.path, "utf-8");
    }

    document.extractedText = extractedText;
    document.processingStatus = "completed";
    await document.save();

    // Log ke history
    await historyService.logActivity(
      userId,
      workspaceId,
      workspace.title,
      "document_uploaded",
      {
        documentId: document._id,
        fileName: document.originalName,
      },
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        workspaceId: document.workspaceId,
        documentId: document._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Ambil daftar dokumen di workspace
exports.getWorkspaceDocuments = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;

    // Pastikan workspace milik user
    const workspace = await Workspace.findOne({ _id: workspaceId, userId });
    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: "Workspace not found or unauthorized",
      });
    }

    const documents = await Document.find({ workspaceId });
    res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};
