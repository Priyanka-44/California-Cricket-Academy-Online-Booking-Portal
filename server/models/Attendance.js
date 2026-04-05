const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    batchName: String,
    level: String,
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);