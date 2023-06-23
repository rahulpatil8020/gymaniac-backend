const express = require("express");

const {
  getUser,
  updateUser,
  deleteUser,
  login,
  signup,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
