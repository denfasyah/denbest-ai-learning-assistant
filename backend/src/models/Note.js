const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: 'General',
      trim: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    sourceType: {
      type: String,
      enum: ['manual', 'summary', 'ai'],
      default: 'manual',
    },
    sourceWorkspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      default: null,
    },
    sourceWorkspaceTitle: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Note', noteSchema);
