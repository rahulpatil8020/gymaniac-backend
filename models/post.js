const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  creator: { type: String, required: true },
  likedBy: { type: Array },
  comments: { type: Array },
  caption: { type: String },
  Tags: { type: Array },
  location: { type: String },
  createdOn: { type: Date, default: new Date() },
  image: { type: String },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
