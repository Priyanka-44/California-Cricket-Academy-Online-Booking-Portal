const express = require("express");
const Batch = require("../models/Batch");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ── public : GET all batches  for programs page
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let filter = {};

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (decoded.role === "coach") {
          filter.coachId = decoded.id;
        }
      } catch (e) {
        // public access
      }
    }

    const batches = await Batch.find(filter);

    //  Real students count 
    const batchesWithCount = await Promise.all(
      batches.map(async (batch) => {
        const realCount = await Student.countDocuments({ batchId: batch._id });
        return { ...batch.toObject(), enrolledStudents: realCount };
      })
    );

    res.json(batchesWithCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches" });
  }
});

//  ADMIN : Create batch 
router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { title, ageGroup, level, fees, coachId } = req.body;
    if (!coachId) return res.status(400).json({ message: "Coach is required" });
    const batch = new Batch({ title, ageGroup, level, fees, coachId });
    await batch.save();
    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (error) {
    console.log("BATCH ERROR:", error);
    res.status(500).json({ message: "Error creating batch" });
  }
});

// ADMIN : Update batch 
router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json({ message: "Batch updated successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Error updating batch" });
  }
});

// ADMIN : Delete batch 
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting batch" });
  }
});

module.exports = router;

