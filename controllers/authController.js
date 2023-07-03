const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// @desc Login
// @route /auth/login
// @access public

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser)
      return res.status(401).json({ message: "User does not exists" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Invalid Credentials" });

    const accessToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// @desc Signup
// @route /auth/signup
// @access public

const signup = async (req, res) => {
  const user = req.body;
  try {
    const duplicate = await User.findOne({ username: user.username })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: "An account already exists with this username" });
    const existing = await User.findOne({ email: user.email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (existing)
      return res
        .status(409)
        .json({ message: "This email is already linked to another account" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = new User({
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: "trainee",
      level: "beginner",
    });
    await newUser.save();
    if (user) res.status(201).json({ message: "Account created successfully" });
    else
      res
        .status(400)
        .json({ message: "Error creating account. Please try again later" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// @desc Refresh
// @route /auth/refresh
// @access Public - Access token refreshed after expiration
const refresh = (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Invalid jwt token provided" });
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          if (err) return res.status(403).json({ message: "Forbidden" });

          const foundUser = await User.findOne({ username: decoded.username });

          if (!foundUser)
            return res.status(401).json({ message: "Unauthorized" });

          const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          res.json({ accessToken });
        } catch (error) {
          return res.status(500).json({ message: "JWT verification failed" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// @desc Logout
// @route POST /auth/logout
// @access Public - Clear the cookies
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie Cleared" });
};

module.exports = { login, signup, refresh, logout };
