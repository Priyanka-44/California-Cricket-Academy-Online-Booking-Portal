import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserHeader from "./UserHeader";
import Footer from "../../components/Footer";

const BASE_URL = "http://localhost:5000/api";

const UserAttendance = () => {
  const [data, setData] = useState([]);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/attendance/my-attendance`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });
        const records = res.data.records || [];
        setData(records);

        const total = records.length;
        const present = records.filter((a) => a.status === "present").length;
        setPercent(total ? Math.round((present / total) * 100) : 0);
      } catch (err) {
        toast.error("Attendance not loaded");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const presentCount = data.filter((a) => a.status === "present").length;
  const absentCount = data.filter((a) => a.status === "absent").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <UserHeader />

      <div className="p-6 max-w-3xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Attendance</h1>
          <p className="text-gray-400 text-sm mt-1">Track your attendance record</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-white">{data.length}</p>
                <p className="text-gray-400 text-sm mt-1">Total Classes</p>
              </div>

              <div className="bg-white/5 border border-green-500/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-green-400">{presentCount}</p>
                <p className="text-gray-400 text-sm mt-1">Present</p>
              </div>

              <div className="bg-white/5 border border-red-500/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-red-400">{absentCount}</p>
                <p className="text-gray-400 text-sm mt-1">Absent</p>
              </div>

            </div>

            {/* Progress Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">

              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Overall Attendance</p>
                <p className={`text-lg font-bold ${percent >= 75 ? "text-green-400" : percent >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {percent}%
                </p>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${percent >= 75 ? "bg-green-400" : percent >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {percent >= 75 ? "✔ Attendance is good!" : percent >= 50 ? "⚠️ improve attendance" : "❌ Attendance is very low!"}
              </p>
            </div>

            {/* Attendance List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Attendance History</h2>
              </div>

              {data.length === 0 ? (
                <div className="text-center py-16 text-gray-400">There is no attendance record</div>
              ) : (
                data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">

                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.batchId?.title || item.batchName || "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(item.date).toDateString()}
                      </p>
                    </div>

                    <span className={`text-lg ${item.status === "present" ? "text-green-400" : "text-red-400"}`}>
                      {item.status === "present" ? "✔" : "✖"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserAttendance;