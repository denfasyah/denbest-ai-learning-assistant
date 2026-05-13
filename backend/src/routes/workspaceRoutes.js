const express = require("express");
const router = express.Router();

const workspaceController = require("../controllers/workspaceController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, workspaceController.createWorkspace);
router.get("/", verifyToken, workspaceController.getUserWorkspaces);
router.get("/:id", verifyToken, workspaceController.getWorkspaceDetail);
router.patch("/:id", verifyToken, workspaceController.updateWorkspace);
router.delete("/:id", verifyToken, workspaceController.deleteWorkspace);
router.delete("/:id", verifyToken, workspaceController.deleteWorkspace);
module.exports = router;