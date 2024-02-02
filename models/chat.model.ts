import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatname: {
      type: String,
      required: [true, "please provide Chat name"],
    },
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMsg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default chatModel;
