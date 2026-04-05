const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const batchRoutes = require("./routes/batchRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const coachRoutes = require("./routes/coachRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
//app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));
const studentRoutes = require("./routes/studentRoutes"); 

app.use("/api/students", studentRoutes); 
app.get("/", (req, res) => {
  res.send("Backend is running successfully ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});