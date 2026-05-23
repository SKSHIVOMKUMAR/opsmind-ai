const express = require("express");

const router = express.Router();

const {
  getChat,
  saveMessage,
  clearChat,
} = require("../controllers/chatController");

// ✅ GET CHAT
router.get("/:sessionId", getChat);

// ✅ SAVE MESSAGE
router.post("/save", saveMessage);

// ✅ CLEAR CHAT
router.delete("/clear/:sessionId", clearChat);

module.exports = router;