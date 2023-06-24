const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       const isPasswordCorrect = await bcrypt.compare(password, user.password);
//       if (isPasswordCorrect) {
//         const token = jwt.sign(
//           { id: user._id, email: user.email },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );
//         res.status(200).json({ token, user });
//       } else {
//         return res.status(401).json({ message: "Invalid Credentials" });
//       }
//     } else return res.status(404).json({ message: "User does not exist" });
//   } catch (error) {
//     res.status(500).json({ message: "Something went Wrong" });
//   }
// };

// const signup = async (req, res) => {
//   const user = req.body;
//   try {
//     const existingUser = await User.findOne({ email: user.email })
//       .lean()
//       .exec();
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }
//     if (user.password !== user.confirmPassword)
//       return res.status(409).json({ message: "Passwords don't match" });
//     const salt = await bcrypt.genSalt(Number(process.env.SALT));
//     const hashedPassword = await bcrypt.hash(user.password, salt);

//     const newUser = new User({
//       email: user.email,
//       password: hashedPassword,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       role: "trainee",
//       level: "beginner",
//     });
//     await newUser.save();
//     const token = jwt.sign(
//       { id: newUser._id, email: newUser.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1hr" }
//     );
//     res.status(200).json({ token, user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

//@desc Login
//@route /auth/login
//@access public

const login = async (req, res) => {};

//desc Signup
//@route /auth/signup
//@access public

const signup = async (req, res) => {};

//@desc Refresh
//@route /auth/refresh
//@access Public - Access token refreshed after expiration
const refresh = async (req, res) => {};

//@desc Logout
//@route POST /auth/logout
//@access Public - Clear the cookies
const logout = async (req, res) => {};
module.exports = { login, signup, refresh, logout };
