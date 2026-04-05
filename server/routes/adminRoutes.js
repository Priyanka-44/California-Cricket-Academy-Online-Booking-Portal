const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Booking = require("../models/Booking");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// GET all users
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// DELETE user
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

router.get(
    "/stats",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {

            const users = await User.countDocuments();
            const batches = await Batch.countDocuments();
            const bookings = await Booking.countDocuments();

            res.json({
                users,
                batches,
                bookings
            });

        } catch (error) {
            res.status(500).json({ message: "Error fetching stats" });
        }
    }
);

module.exports = router;