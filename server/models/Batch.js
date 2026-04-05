const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    title:    { 
      type: String, 
      required: true 
    },
    ageGroup: { 
      type: String, 
      required: true 
    },
    level:    { 
      type: String, 
      required: true 
    },
    fees:     { 
      type: Number, 
      required: true 
    },
    coachId:  { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    slots:    { 
      type: Number, 
      default: 20 
    },
    enrolledStudents: { 
      type: Number, 
      default: 0 
    },
    description:  { 
      type: String, 
      default: "" 
    },
    schedule:     { 
      type: String, 
      default: "" 
    },
    whatYouLearn: { 
      type: [String], 
      default: [] 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);