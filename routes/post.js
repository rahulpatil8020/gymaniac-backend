const express = require("express");

const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  comment,
} = require("../controllers/postController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router.get("/", getAllPosts);
router.get("/:id", getPost);
// router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like/:id", likePost);
router.patch("/comment/:id", comment);

module.exports = router;
