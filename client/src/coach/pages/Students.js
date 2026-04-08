import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import CoachHeader from "../components/CoachHeader";

const CoachStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://california-cricket-academy-online.onrender.com/api/students", {
        headers: {
           Authorization: `Bearer ${token}` 
          },
      });
      setStudents(res.data);
    } 
    catch (err) {
      console.log(err);
    } 
    finally { 
      setLoading(false); 
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <CoachHeader />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-1">My Students</h1>
        <p className="text-gray-400 text-sm mb-6">View all students in your batches</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

          <div className="grid grid-cols-5 px-5 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest bg-white/5">
            <span>Student</span>
            <span>Email</span>
            <span>Batch</span>
            <span>Level</span>
            <span>Attendance</span>
          </div>

          
          {loading ? (
            <div className="text-center py-16 text-gray-400">⏳ Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No students found</div>
          ) : (
            students.map((s) => (
              <div key={s._id}
                className="grid grid-cols-5 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {getInitials(s.name)}
                  </div>
                  <span className="text-sm font-medium text-white">{s.name}</span>
                </div>

                <span className="text-xs text-gray-400 truncate">{s.email}</span>

                <span className="text-sm text-gray-300">{s.batch || s.batchId?.title || "—"}</span>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 w-fit">
                  {s.level || s.batchId?.level || "—"}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full">
                    <div
                      className="h-2 bg-green-400 rounded-full transition-all"
                      style={{ width: `${s.attendance || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-8 text-right">{s.attendance || 0}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoachStudents;