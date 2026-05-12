const express = require("express");

const router = express.Router({ mergeParams: true });

const {
sendMessage,
getChatHistory,
} = require("../controllers/chatController");

router.post("/", sendMessage);

router.get("/history", getChatHistory);

module.exports = router;