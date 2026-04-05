const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch"
  },
});

module.exports = mongoose.model("Student", studentSchema);