const express = require("express");
const router = express.Router({ mergeParams: true });

const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadDocument,
  getWorkspaceDocuments,
} = require("../controllers/documentController");

router.post("/", verifyToken, upload.single("file"), uploadDocument);

router.get("/", verifyToken, getWorkspaceDocuments);

module.exports = router;
