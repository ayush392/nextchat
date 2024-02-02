import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roomId: {
      type: String,
      required: true,
    },
    status: {
      isRead: {
        type: Boolean,
        default: false,
      },
      readTime: Date,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;
