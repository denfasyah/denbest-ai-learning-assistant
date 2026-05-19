const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },

    workspaceTitle: {
      type: String,
      default: "",
    },

    actionType: {
      type: String,
      enum: [
        "workspace_created",
        "workspace_deleted",
        "workspace_renamed",
        "document_uploaded",
        "chat_sent",
        "summary_generated",
        "flashcard_generated",
        "quiz_completed",
        "assistant_chat",
        "note_created",
        "profile",
        "setting",
      ],
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);