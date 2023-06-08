import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  creator: { type: String, required: true },
  likeCount: { type: Number },
  comments: { type: Array },
  caption: { type: String },
  Tags: { type: Array },
  location: { type: String },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
