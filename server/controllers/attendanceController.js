const Attendance = require("../models/Attendance");
const Batch = require("../models/Batch");
const Student = require("../models/Student");

// MARK ATTENDANCE 

const markAttendance = async (req, res) => {
  try {
    const { batchId, date, records } = req.body;

    if (!records || records.length === 0) {
      return res.status(400).json({ message: "No attendance records provided" });
    }

    const attendanceDate = date ? new Date(date) : new Date();

    // Remove old records for same batch + date 
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    await Attendance.deleteMany({
      batchId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const docs = records.map(({ studentId, status }) => ({
      studentId,
      batchId,
      status,
      date: attendanceDate,
    }));

    const saved = await Attendance.insertMany(docs);

    return res.status(201).json({
      message: "Attendance marked successfully",
      count: saved.length,
      data: saved,
    });
  } catch (err) {
    console.error("markAttendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//GET STUDENTS BY BATCH (for coach ) 
// GET /api/attendance/batch/:batchId/students
const getStudentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const students = await Student.find({ batchId }).select("name email batchId");

    return res.status(200).json({ students });
  } catch (err) {
    console.error("getStudentsByBatch error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//GET BATCHES FOR LOGGED-IN COACH 
// GET /api/attendance/coach-batches
const getCoachBatches = async (req, res) => {
  try {
    const coachId = req.user.id; // from authMiddleware

    const batches = await Batch.find({ coachId }).select("title level ageGroup");

    return res.status(200).json({ batches });
  } catch (err) {
    console.error("getCoachBatches error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//GET ATTENDANCE BY DATE (for coach to review)

const getAttendanceByDate = async (req, res) => {
  try {
    const { batchId, date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      date: { $gte: startOfDay, $lte: endOfDay },
    };
    if (batchId && batchId !== "all") query.batchId = batchId;

    const records = await Attendance.find(query)
      .populate("studentId", "name email")
      .populate("batchId", "title level");

    return res.status(200).json({ records });
  } catch (err) {
    console.error("getAttendanceByDate error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET USER'S OWN ATTENDANCE (for student dashboard) 
// GET /api/attendance/my-attendance
const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find student linked to this user
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const records = await Attendance.find({ studentId: student._id })
      .populate("batchId", "title level")
      .sort({ date: -1 });

    return res.status(200).json({ records });
  } catch (err) {
    console.error("getMyAttendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  markAttendance,
  getStudentsByBatch,
  getCoachBatches,
  getAttendanceByDate,
  getMyAttendance,
};