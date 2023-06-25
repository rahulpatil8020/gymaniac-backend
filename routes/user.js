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

router.route("/:id").get(getUser);
router.route("/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);

module.exports = router;
