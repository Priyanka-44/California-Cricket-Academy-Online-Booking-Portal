const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Student = require("../models/Student");
const User = require("../models/User");
const Batch = require("../models/Batch");
const sendEmail = require("../config/email");

const router = express.Router();

// CREATE BOOKING 
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { batchId } = req.body;

    const booking = new Booking({
      userId: req.user.id,
      batchId,
      paymentStatus: "pending",
    });
    await booking.save();

    // Student create 
    const user = await User.findById(req.user.id);
    const existing = await Student.findOne({ email: user.email, batchId });
    if (!existing) {
      await Student.create({ name: user.name, email: user.email, batchId });
    }

    res.status(201).json({ message: "Booking + Student created", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

// USER BOOKINGS 
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("batchId", "title level fees")
      .populate("userId", "name email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ADMIN ALL BOOKINGS 
router.get("/admin", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("batchId", "title level");
    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// UPDATE PAYMENT + EMAIL 
router.put("/payment/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid" },
      { new: true }
    );

    const user = await User.findById(booking.userId);
    const batch = await Batch.findById(booking.batchId);

    // Student duplicate check
    const existing = await Student.findOne({ email: user.email, batchId: booking.batchId });
    if (!existing) {
      await Student.create({ name: user.name, email: user.email, batchId: booking.batchId });
    }

    // Increment enrolled count
    await Batch.findByIdAndUpdate(booking.batchId, { $inc: { enrolledStudents: 1 } });

    //  EMAIL SEND
    try {
      await sendEmail(
        user.email,
        "Cricket Academy Booking Confirmed 🏏✅",
        `Hello ${user.name},\n\nYour booking has been confirmed.\n\nBatch Details:\nBatch: ${batch.title}\nLevel: ${batch.level}\n\nThank you for booking with our academy.`
      );
      console.log("✅ Email sent to:", user.email);
    } catch (emailErr) {
      console.log("Email send failed:", emailErr.message);
    }

    res.json({ message: "Payment successful + student added", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Payment update failed" });
  }
});

module.exports = router;