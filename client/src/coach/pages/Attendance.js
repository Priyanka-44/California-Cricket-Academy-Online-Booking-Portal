import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CoachHeader from "../components/CoachHeader";
import Footer from "../../components/Footer";

const BASE_URL = "http://localhost:5000/api";

const levelColors = {
  Beginner: "bg-green-500/20 text-green-300 border border-green-500/40",
  Intermediate: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
  Advanced: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
};

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const Attendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelected] = useState("all");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]  = useState(false);

  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}` 
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/attendance/coach-batches`, { headers });
        setBatches(res.data.batches || []);
      } catch (err) {
        toast.error("Batches not loaded");
        console.log(err);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setStudents([]);
      setAttendance({});
      setLoading(true);
      try {
        if (selectedBatch === "all") {
          const promises = batches.map((b) =>
            axios.get(`${BASE_URL}/attendance/batch/${b._id}/students`, { headers })
          );
          const results = await Promise.all(promises);
          const all = results.flatMap((r) => r.data.students || []);
          setStudents(all);
        } else {
          const res = await axios.get(
            `${BASE_URL}/attendance/batch/${selectedBatch}/students`,
            { headers }
          );
          setStudents(res.data.students || []);
        }
      } catch (err) {
        toast.error("Students not loaded");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (batches.length > 0) fetchStudents();
  }, [selectedBatch, batches]);

  const mark = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    const unmarked = students.filter((s) => !attendance[s._id]);
    if (unmarked.length > 0) {
      toast.warning(`${unmarked.length} Students' attendance was not marked.!`);
      return;
    }
    setSaving(true);
    try {
      const batchGroups = {};
      students.forEach((s) => {
        const bid = s.batchId?._id || s.batchId;
        if (!batchGroups[bid]) batchGroups[bid] = [];
        batchGroups[bid].push({ studentId: s._id, status: attendance[s._id] });
      });
      for (const [batchId, records] of Object.entries(batchGroups)) {
        await axios.post(
          `${BASE_URL}/attendance/mark`,
          { batchId, records, date: new Date() },
          { headers }
        );
      }
      toast.success("Attendance saved successfully!");
      setAttendance({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Not saved");
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const getBatchInfo = (batchId) => {
    const id = batchId?._id || batchId;
    return batches.find((b) => b._id === id) || {};
  };

  const markedCount  = Object.keys(attendance).length;
  const presentCount = Object.values(attendance).filter((s) => s === "present").length;
  const absentCount  = markedCount - presentCount;
  const progress = students.length > 0 ? (markedCount / students.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">

      <CoachHeader />

      <div className="flex-1 p-6">

        {/* Title + Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Mark Attendance</h1>
            <p className="text-gray-400 mt-1 text-sm">Mark today's attendance for your students</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-white">{students.length}</p>
              <p className="text-xs text-gray-200">Total</p>
            </div>
            <div className="bg-white/5 border border-green-500/20 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-green-400">{presentCount}</p>
              <p className="text-xs text-gray-200">Present</p>
            </div>
            <div className="bg-white/5 border border-red-500/20 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-red-400">{absentCount}</p>
              <p className="text-xs text-gray-200">Absent</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/5 border border-green-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs text-green-300 uppercase tracking-widest mb-2">Select Batch</p>
            <select
              className="bg-white/10 border border-green-500/30 text-white rounded-xl px-4 py-2 text-sm outline-none cursor-pointer min-w-[220px]"
              value={selectedBatch}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="all" className="bg-gray-900">All Batches</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id} className="bg-gray-900">{b.title}</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-300 uppercase tracking-widest mb-1">Date</p>
            <p className="text-gray-200 font-bold text-lg">{today}</p>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white/5 border border-green-500/20 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/10">
            <h2 className="text-xl font-bold text-white">Student List</h2>
            <button
              onClick={saveAttendance}
              disabled={saving || markedCount === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all
                ${saving || markedCount === 0
                  ? "bg-green-700/40 text-green-300 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white cursor-pointer"
                }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving...
                </>
              ) : <> Save Attendance</>}
            </button>
          </div>

          {/* Progress Bar */}
          {students.length > 0 && (
            <div className="h-1 bg-white/5">
              <div
                className="h-1 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Rows */}
          {loading ? (
            <div className="text-center py-16 text-green-300">⏳ Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-green-300">There are no students in this batch.</div>
          ) : (
            students.map((student) => {
              const batch  = getBatchInfo(student.batchId);
              const level  = batch.level || "Beginner";
              const status = attendance[student._id];
              return (
                <div key={student._id}
                  className={`flex items-center gap-4 px-6 py-4 border-b border-white/5 transition-all duration-200 hover:bg-white/5
                    ${status === "present" ? "border-l-2 border-l-green-400 bg-green-500/5" : ""}
                    ${status === "absent"  ? "border-l-2 border-l-red-400 bg-red-500/5"    : ""}
                  `}
                >
                  <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                    {getInitials(student.name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{student.name}</p>
                    <p className="text-xs text-green-300">{batch.title || "—"}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${levelColors[level] || levelColors.Beginner}`}>
                    {level}
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => mark(student._id, "present")}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer
                        ${status === "present"
                          ? "bg-green-500/25 border-green-400 text-green-400"
                          : "bg-transparent border-white/20 text-gray-400 hover:border-green-400/50"
                        }`}>Present</button>
                    <button onClick={() => mark(student._id, "absent")}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer
                        ${status === "absent"
                          ? "bg-red-500/25 border-red-400 text-red-400"
                          : "bg-transparent border-white/20 text-gray-400 hover:border-red-400/50"
                        }`}>Absent</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Attendance;

