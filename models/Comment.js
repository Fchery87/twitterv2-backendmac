import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema(
  {
    commentText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);