const Chat = require("../models/chatModel");


// ✅ GET CHAT
exports.getChat = async (req, res) => {
  try {

    const { sessionId } = req.params;

    const chat = await Chat.findOne({ sessionId });

    if (!chat) {
      return res.json({
        messages: [],
      });
    }

    res.json(chat);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch chat",
    });
  }
};


// ✅ SAVE CHAT MESSAGE
exports.saveMessage = async (req, res) => {
  try {

    const {
      sessionId,
      message,
    } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        error: "Missing data",
      });
    }

    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = await Chat.create({
        sessionId,
        messages: [message],
      });
    } else {
      chat.messages.push(message);
      await chat.save();
    }

    res.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save message",
    });
  }
};

// ✅ CLEAR CHAT
exports.clearChat = async (req, res) => {
  try {

    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: "Session ID required",
      });
    }

    await Chat.findOneAndUpdate(
      { sessionId },
      { messages: [] }
    );

    res.json({
      success: true,
      message: "Chat cleared successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to clear chat",
    });
  }
};