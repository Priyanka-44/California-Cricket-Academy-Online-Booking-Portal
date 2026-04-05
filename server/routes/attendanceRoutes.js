const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  markAttendance,
  getStudentsByBatch,
  getCoachBatches,
  getAttendanceByDate,
  getMyAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

// Coach Routes 

router.get("/coach-batches", authMiddleware, getCoachBatches);

router.get("/batch/:batchId/students", authMiddleware, getStudentsByBatch);

router.post("/mark", authMiddleware, markAttendance);

// GET attendance records by date (coach review)
router.get("/by-date", authMiddleware, getAttendanceByDate);

// Student / User Routes  

//student's own attendance history for user dashboard
router.get("/my-attendance", authMiddleware, getMyAttendance);

module.exports = router;
