const express = require("express");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const authMiddleware = require("../middleware/authMiddleware");
const Batch = require("../models/Batch");
const router = express.Router();

// GET STUDENTS WITH ATTENDANCE 
router.get("/", authMiddleware, async (req, res) => {
  try {

    // coach ke batches
    const batches = await Batch.find({ coachId: req.user.id });
    const batchIds = batches.map(b => b._id);

    // students of those batches
    const students = await Student.find({
      batchId: { $in: batchIds }
    }).populate("batchId");

    const result = [];

    for (let student of students) {

      const total = await Attendance.countDocuments({
        studentId: student._id
      });

      const present = await Attendance.countDocuments({
        studentId: student._id,
        status: "present"
      });

      const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

      result.push({
        _id: student._id,
        name: student.name,
        email: student.email,
        batch: student.batchId?.title,
        level: student.batchId?.level,
        attendance: percentage
      });
    }

    res.json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching students" });
  }
});

router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error creating student" });
  }
});

module.exports = router;