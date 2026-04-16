const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Booking = require("../models/Booking");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ADMIN DASHBOARD
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalCoaches = await User.countDocuments({
        role: "coach",
      });

      const totalBatches =
        await Batch.countDocuments();

      const totalBookings =
        await Booking.countDocuments({
          paymentStatus: "paid",
        });

      const bookings = await Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: "$batchId",
            count: { $sum: 1 },
          },
        },
      ]);

      const batches = await Batch.find();

      const chartData = batches.map((batch) => {
        const found = bookings.find(
          (b) =>
            b._id?.toString() ===
            batch._id.toString()
        );

        return {
          batch: batch.title,
          enrolledStudents: found
            ? found.count
            : 0,
          maxCapacity:
            batch.slots || 20,
        };
      });

      res.json({
        totalUsers,
        totalCoaches,
        totalBatches,
        totalBookings,
        chartData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Dashboard error",
      });
    }
  }
);

module.exports = router;

