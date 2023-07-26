const express = require("express");
const { login, signup } = require("../controllers/authController");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getUser);
router.route("/").patch(updateUser);
router.route("/").delete(deleteUser);

module.exports = router;
