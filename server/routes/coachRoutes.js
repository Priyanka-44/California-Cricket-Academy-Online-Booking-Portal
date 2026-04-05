const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");
const router = express.Router();


// GET ALL ENROLLED STUDENTS
router.get(
    "/students",
    authMiddleware,
    roleMiddleware("coach"),
    async (req, res) => {

        try {

            const students = await Booking.find()
                .populate("userId", "name email")
                .populate("batchId", "title level");

            res.json(students);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Error fetching students"
            });

        }

    });
    
// GET ALL COACHES
router.get("/", async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" }).select("name email");
    res.json(coaches);
  } catch (err) {
    console.log("COACH ERROR:", err); // ⭐ debug
    res.status(500).json({ message: "Error fetching coaches" });
  }
});

module.exports = router;