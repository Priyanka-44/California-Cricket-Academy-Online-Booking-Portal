const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/upload");
const router = express.Router();


//  REGISTER 
router.post("/register", async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // ADMIN LIMIT
    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });

      if (adminExists) {
        return res.status(400).json({
          message: "Admin already exists"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

});


//  LOGIN 
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

});


//  GET PROFILE 
router.get("/profile", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }

});


//   UPDATE PROFILE + IMAGE 
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {

    try {

      const { name, phone, address } = req.body;

      const updateData = {
        name,
        phone,
        address
      };


      if (req.file) {
        updateData.avatar = `/uploads/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select("-password");

      res.json(user);

    } catch (error) {
      res.status(500).json({ message: "Update failed" });
    }

  }
);


// POST /api/auth/check-email
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Email found" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});


// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;