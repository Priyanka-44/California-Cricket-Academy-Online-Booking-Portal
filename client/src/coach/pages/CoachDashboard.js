import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Layers, Users, CalendarCheck } from "lucide-react";
import CoachHeader from "../components/CoachHeader";
import Footer from "../../components/Footer";

const CoachDashboard = () => {
  const navigate = useNavigate();
  const [batches, setBatches]  = useState([]);
  const [coachName, setCoachName] = useState("");
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalStudents: 0,
    todayAttendance: "Today",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const profileRes = await axios.get("http://localhost:5000/api/auth/profile", { headers });
      setCoachName(profileRes.data.name || "Coach");

      const batchRes = await axios.get("http://localhost:5000/api/batches", { headers });
      const data = batchRes.data;
      setBatches(data);

      let totalStudents = 0;
      for (const batch of data) {
        const stuRes = await axios.get(
          `http://localhost:5000/api/attendance/batch/${batch._id}/students`,
          { headers }
        );
        totalStudents += (stuRes.data.students || []).length;
      }

      setStats({ totalBatches: data.length, totalStudents, todayAttendance: "Today" });
    } catch (err) { console.log(err); }
  };

  const levelColors = {
    Beginner: "bg-green-500/20 text-green-300",
    Intermediate: "bg-purple-500/20 text-purple-300",
    Advanced: "bg-orange-500/20 text-orange-300",
  };

  const cards = [
    {
      icon: <Layers size={22} className="text-white" />,
      iconBg: "bg-gradient-to-br from-gray-600 to-emerald-700",
      value: stats.totalBatches,
      label: "My Batches",
      onClick: null,
    },
    {
      icon: <Users size={22} className="text-white" />,
      iconBg: "bg-gradient-to-br from-gray-600 to-blue-700",
      value: stats.totalStudents,
      label: "Students",
      onClick: () => navigate("/coach/students"),
    },
    {
      icon: <CalendarCheck size={22} className="text-white" />,
      iconBg: "bg-gradient-to-br from-gray-600 to-purple-700",
      value: stats.todayAttendance,
      label: "Attendance",
      onClick: () => navigate("/coach/attendance"),
      valueColor: "text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <CoachHeader />

      <div className="flex-1 p-6">
        
        <h1 className="text-3xl font-bold text-white">Coach Dashboard</h1>
        <p className="text-gray-400 mb-6 text-sm mt-1">Welcome back, {coachName}! 👋</p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={card.onClick}
              className={`relative overflow-hidden bg-white/5 border border-white/10 p-5 rounded-2xl transition-all
                ${card.onClick ? "cursor-pointer hover:bg-white/10" : ""}`}
            >
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${card.iconBg} opacity-20 blur-xl`} />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {card.icon}
                </div>
                <p className="text-gray-300 text-sm font-medium">{card.label}</p>
              </div>

              <h2 className={`text-3xl font-bold ${card.valueColor || "text-white"}`}>
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Batch List */}
        <div className="bg-white/5 border border-green-500/20 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-white">My Batches</h2>
          <div className="space-y-3">
            {batches.length === 0 ? (
              <p className="text-green-300 text-sm text-center py-6">No batch found</p>
            ) : (
              batches.map((batch) => (
                <div key={batch._id}
                  className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{batch.title}</h3>
                    <p className="text-xs text-green-300 mt-1">
                      👥 {batch.enrolledStudents} students • ₹{batch.fees}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[batch.level] || levelColors.Beginner}`}>
                    {batch.level}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoachDashboard;

