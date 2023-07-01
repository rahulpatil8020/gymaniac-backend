const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const getUser = async (req, res) => {
  const username = req.user;
  try {
    const user = await User.findOne({ username: username })
      .select("-password")
      .lean();
    if (!user) return res.status(404).send(`No user with username ${username}`);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No user with id ${id}`);

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No user with id ${id}`);

    await User.findByIdAndRemove(id);
    res.status(200).json(id);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getUser, deleteUser, updateUser };
