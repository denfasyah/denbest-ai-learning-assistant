const express = require("express");

const router = express.Router();

const {
uploadDocument,
getWorkspaceDocuments,
} = require("../controllers/documentController");

router.post(
"/workspaces/:workspaceId/documents",
uploadDocument
);

router.get(
"/workspaces/:workspaceId/documents",
getWorkspaceDocuments
);

module.exports = router;
