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
// const salt = await bcrypt.genSalt(Number(process.env.SALT));
// const hashedPassword = await bcrypt.hash(user.password, salt);

// const newUser = new User({
//   email: user.email,
//   password: hashedPassword,
//   firstName: user.firstName,
//   lastName: user.lastName,
//   role: "trainee",
//   level: "beginner",
// });
// await newUser.save();
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

// @desc Login
// @route /auth/login
// @access public

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser)
      return res.status(401).json({ message: "User does not exists" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Invalid Credentials" });

    const accessToken = jwt.sign(
      {
        email: foundUser.email,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
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
    const duplicate = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate)
      return res
        .status(409)
        .json({ message: "An account already exists with this email" });

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
    if (user) res.status(201).json({ message: "Accoutn created successfully" });
    else
      res
        .status(400)
        .json({ message: "Error  creating account. Please try again later" });
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
    console.log(req);
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Invalid jwt token provided" });
    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          if (err) return res.status(403).json({ message: "Forbidden" });

          const foundUser = await User.findOne({ email: decoded.email });

          if (!foundUser)
            return res.status(401).json({ message: "Unauthorized" });

          const accessToken = jwt.sign(
            { user: foundUser.email },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "20s" }
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
