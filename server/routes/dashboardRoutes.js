const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Booking = require("../models/Booking");
const Student = require("../models/Student");

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
      // ⭐ totalUsers = sab users (admin + coach + user)
      const totalUsers    = await User.countDocuments();
      const totalCoaches  = await User.countDocuments({ role: "coach" });
      const totalBatches  = await Batch.countDocuments();
      const totalBookings = await Booking.countDocuments({ paymentStatus: "paid" });

      // Bookings per batch (paid only)
      const bookings = await Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: "$batchId", count: { $sum: 1 } } }
      ]);

      const batches = await Batch.find();

      // Chart — real students count
      const chartData = await Promise.all(
        batches.map(async (batch) => {
          const found = bookings.find(
            (b) => b._id?.toString() === batch._id.toString()
          );
          const realStudents = await Student.countDocuments({ batchId: batch._id });

          return {
            batch:            batch.title,
            bookings:         found ? found.count : 0,
            enrolledStudents: realStudents,
            maxCapacity:      batch.slots || 20,
          };
        })
      );

      res.json({
        totalUsers,
        totalCoaches,
        totalBatches,
        totalBookings,
        chartData,
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Dashboard error" });
    }
  }
);

module.exports = router;

// const express = require("express");
// const User = require("../models/User");
// const Batch = require("../models/Batch");
// const Booking = require("../models/Booking");
// const Student = require("../models/Student");

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// const router = express.Router();

// // ADMIN DASHBOARD
// router.get(
//   "/admin",
//   authMiddleware,
//   roleMiddleware("admin"),
//   async (req, res) => {
//     try {
//       const totalUsers    = await User.countDocuments({ role: "user" });
//       const totalCoaches  = await User.countDocuments({ role: "coach" });
//       const totalBatches  = await Batch.countDocuments();
//       const totalBookings = await Booking.countDocuments({ paymentStatus: "paid" }); // ⭐ sirf paid bookings

//       // Bookings per batch (paid only)
//       const bookings = await Booking.aggregate([
//         { $match: { paymentStatus: "paid" } },
//         { $group: { _id: "$batchId", count: { $sum: 1 } } }
//       ]);

//       const batches = await Batch.find();

//       // Chart — real students count from Student collection
//       const chartData = await Promise.all(
//         batches.map(async (batch) => {
//           const found = bookings.find(
//             (b) => b._id?.toString() === batch._id.toString()
//           );
//           // Real students count
//           const realStudents = await Student.countDocuments({ batchId: batch._id });

//           return {
//             batch:            batch.title,
//             bookings:         found ? found.count : 0,
//             enrolledStudents: realStudents,
//             maxCapacity:      batch.slots || 20,
//           };
//         })
//       );

//       res.json({
//         totalUsers,
//         totalCoaches,
//         totalBatches,
//         totalBookings,
//         chartData,
//       });

//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Dashboard error" });
//     }
//   }
// );

// module.exports = router;
