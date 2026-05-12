const express = require("express");

const router = express.Router();

const {
createWorkspace,
getUserWorkspaces,
getWorkspaceDetail,
updateWorkspace,
deleteWorkspace,
} = require("../controllers/workspaceController");

router.post("/", createWorkspace);

router.get("/", getUserWorkspaces);

router.get("/", getWorkspaceDetail);

router.patch("/", updateWorkspace);

router.delete("/", deleteWorkspace);

module.exports = router;