const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No user with id ${id}`);

    const user = await User.findById(id);
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

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token, user });
      } else {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
    } else return res.status(404).json({ message: "User does not exist" });
  } catch (error) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};

const signup = async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (user.password !== user.confirmPassword)
      return res.status(409).json({ message: "Passwords don't match" });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = new User({
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      role: "trainee",
      level: "beginner",
    });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
    res.status(200).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
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

module.exports = { getUser, deleteUser, updateUser, login, signup };
