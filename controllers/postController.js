const Post = require("../models/post.js");
const mongoose = require("mongoose");
const { uploadToS3, getImageFromS3 } = require("../config/s3.js");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    const finalPosts = [];
    let imageURL;
    for (let post of posts) {
      if (post.imageKey) {
        imageURL = await getImageFromS3(post.imageKey);
        finalPosts.push({ ...post._doc, imageURL });
      } else finalPosts.push({ ...post._doc });
    }
    finalPosts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
    res.status(200).json(finalPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id ${id}`);
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const { creator, caption, creatorName, createdOn } = req.body;
  // Access the image data from req.file
  const image = req.file;
  let post;
  try {
    if (image) {
      const imageKey = await uploadToS3({ file: image, username: creator });
      post = {
        creator,
        caption,
        creatorName,
        imageKey: imageKey?.key,
        createdOn,
      };
    } else {
      post = {
        creator,
        caption,
        creatorName,
        createdOn,
      };
    }

    const newPost = new Post(post);
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  const post = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id : ${id}`);

    await Post.findByIdAndRemove(id);
    res.status(200).json(id);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getAllPosts, getPost, updatePost, deletePost, createPost };
