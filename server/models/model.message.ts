import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        requred: true,
      },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("messages", messageSchema);
