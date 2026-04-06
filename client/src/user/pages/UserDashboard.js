import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, ClipboardList, CalendarCheck } from "lucide-react";
import UserHeader from "./UserHeader";
import Footer from "../../components/Footer";

const BASE_URL = "http://localhost:5000/api";

const statusColors = {
  paid: "bg-green-500/20 text-green-300 border-green-500/40",
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  failed: "bg-red-500/20 text-red-300 border-red-500/40",
};

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.log(err);
      } finally { setLoading(false); }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <UserHeader />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back!</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => navigate("/user/attendance")}
            className="relative overflow-hidden bg-white/5 border border-green-500/20 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all group"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 opacity-20 group-hover:opacity-30 blur-xl transition-opacity" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-emerald-500 flex items-center justify-center text-lg mb-3"><ClipboardList /></div>
            <p className="text-xl font-bold text-white">{bookings.length}</p>
            <p className="text-gray-400 text-sm mt-1">My Attendance</p>
          </div>

          <div
            onClick={() => navigate("/user/profile")}
            className="relative overflow-hidden bg-white/5 border border-blue-500/20 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all group"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 opacity-20 group-hover:opacity-30 blur-xl transition-opacity" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-blue-500 flex items-center justify-center text-lg mb-3"><Users /></div>
            <p className="text-xl font-bold text-white">View</p>
            <p className="text-gray-400 text-sm mt-1">My Profile</p>
          </div>

          <div className="relative overflow-hidden bg-white/5 border border-purple-500/20 rounded-2xl p-5 group">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 opacity-20 blur-xl" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-purple-500 flex items-center justify-center text-lg mb-3"><CalendarCheck /></div>
            <p className="text-xl font-bold text-white">{bookings.length}</p>
            <p className="text-gray-400 text-sm mt-1">My Bookings</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">My Bookings</h2>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">⏳ Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">There are no bookings right now</div>
          ) : (
            <>
              {/* Header row */}
              <div className="grid grid-cols-4 px-6 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest">
                <span>Batch</span>
                <span>Level</span>
                <span>Status</span>
                <span>Date</span>
              </div>

              {bookings.map((b) => {
                const sc = statusColors[b.paymentStatus] || statusColors.pending;
                return (
                  <div key={b._id} className="grid grid-cols-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center">
                    <span className="text-sm text-white font-medium">{b.batchId?.title || "—"}</span>
                    <span className="text-sm text-gray-300">{b.batchId?.level || "—"}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${sc}`}>
                      {b.paymentStatus}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(b.createdAt).toDateString()}</span>
                  </div>
                );
              })}

            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;