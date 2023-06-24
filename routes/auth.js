const express = require("express");
const {
  login,
  signup,
  refresh,
  logout,
} = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

const router = express.Router();

router.route("/login").post(loginLimiter, login);
router.route("/signup").post(signup);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);

module.exports = router;
