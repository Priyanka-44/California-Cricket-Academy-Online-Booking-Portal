const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const Batch = require("../models/Batch");
const Student = require("../models/Student");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET all batches
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let filter = {};

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );

        if (decoded.role === "coach") {
          filter.coachId = decoded.id;
        }
      } catch (e) { }
    }

    const batches = await Batch.find(filter);

    const batchesWithCount = await Promise.all(
      batches.map(async (batch) => {
        const realCount = await Student.countDocuments({
          batchId: batch._id,
        });

        return {
          ...batch.toObject(),
          enrolledStudents: realCount,
        };
      })
    );

    res.json(batchesWithCount);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching batches",
    });
  }
});

// CREATE batch
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const {
        title,
        ageGroup,
        level,
        fees,
        coachId,
        description,
        schedule,
        whatYouLearn,
      } = req.body;

      const batch = new Batch({
        title,
        ageGroup,
        level,
        fees,
        coachId,
        description,
        schedule,
        whatYouLearn,
      });

      await batch.save();

      res.status(201).json({
        message: "Batch created successfully",
        batch,
      });
    } catch (error) {
      console.log("CREATE ERROR:", error);
      res.status(500).json({
        message: "Error creating batch",
      });
    }
  }
);


router.post(
  "/import",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload file",
        });
      }


      const defaultCoach = await User.findOne({
        role: "coach",
      });

      if (!defaultCoach) {
        return res.status(400).json({
          message: "No coach found in system",
        });
      }

      const workbook = XLSX.read(req.file.buffer, {
        type: "buffer",
      });

      const sheetName = workbook.SheetNames[0];

      const rows = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );


      //   title:
      //     row.title ||
      //     row.Title ||
      //     row["Program Name"] ||
      //     row["Program"] ||
      //     `Imported Program ${index + 1}`,

      //   ageGroup:
      //     row.ageGroup ||
      //     row["Age Group"] ||
      //     row["Age group"] ||
      //     row["AgeGroup"] ||
      //     row["Age"] ||
      //     "All Ages",

      //   level:
      //     row.level ||
      //     row.Level ||
      //     "Beginner",

      //   fees: Number(
      //     row.fees ||
      //     row.Fees ||
      //     row.Price ||
      //     row["Program Fee"] ||
      //     0
      //   ),

      //   coachId: defaultCoach._id,

      //   description:
      //     row.description ||
      //     row.Description ||
      //     "",

      //   schedule:
      //     row.schedule ||
      //     row.Schedule ||
      //     row["Time"] ||
      //     row["Timings"] ||
      //     "Mon, Wed, Fri - 4:00 PM to 6:00 PM",

      //   whatYouLearn:
      //     row.whatYouLearn ||
      //     row["What You Learn"]
      //       ? String(
      //           row.whatYouLearn ||
      //           row["What You Learn"]
      //         )
      //           .split(",")
      //           .map((x) => x.trim())
      //       : [],
      // }));
      const formattedRows = rows.map((row) => {

        const scheduleOptions = Object.keys(row)
          .filter((key) =>
            key.includes("batch_option")
          )
          .map((key) => row[key])
          .filter(Boolean);

        return {
          title: row["Name"] || "Imported Program",


          ageGroup: row["Tags"]
            ? row["Tags"].split(",")[0].trim()
            : "All Ages",


          level: row["Tags"]
            ? row["Tags"].split(",")[1]?.trim() ||
            "Beginner"
            : "Beginner",


          fees: Number(row["Regular price"] || 0),

          coachId: defaultCoach._id,

          description:
            row["Categories"] ||
            "Summer Cricket Program",


          schedule: scheduleOptions.join(" | "),

          whatYouLearn: [
            row["Categories"] || "Cricket Training",
            `${row["Meta: no_of_session"] || 0} sessions`,
          ],
        };
      });

      await Batch.insertMany(formattedRows);

      res.json({
        message: "Bulk import successful",
        count: formattedRows.length,
      });
    } catch (error) {
      console.log("IMPORT ERROR:", error);
      res.status(500).json({
        message: "Import failed",
      });
    }
  }
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const batch = await Batch.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json({
        message: "Updated successfully",
        batch,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating batch",
      });
    }
  }
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      await Batch.findByIdAndDelete(req.params.id);

      res.json({
        message: "Deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting batch",
      });
    }
  }
);

module.exports = router;

