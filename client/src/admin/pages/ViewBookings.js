import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";
import Footer from "../../components/Footer";

const BASE_URL = "http://localhost:5000/api";

const statusColors = {
  paid: "bg-green-500/20 text-green-300 border-green-500/40",
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  failed: "bg-red-500/20 text-red-300 border-red-500/40",
};

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("useEffect chala!");
    const fetchBookings = async () => {
      try {
        console.log("Fetch start");
        const res = await axios.get(`${BASE_URL}/bookings/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response:", res.data);
        setBookings(res.data);
      } catch (err) {
        console.log("Error:", err.response?.data);
        toast.error("Bookings load nahi hue");
      } finally { setLoading(false); }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.userId?.name?.toLowerCase().includes(q) ||
      b.userId?.email?.toLowerCase().includes(q) ||
      b.batchId?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminHeader />
      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">All Bookings</h1>
            <p className="text-gray-400 text-sm mt-1">{bookings.length} total bookings</p>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500/50 min-w-[260px]"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No bookings found</div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 px-5 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest">
              <span>User</span>
              <span>Email</span>
              <span>Batch</span>
              <span>Level</span>
              <span>Payment</span>
              <span>Date</span>
            </div>

            {/* Rows */}
            {filtered.map((b) => {
              const sc = statusColors[b.paymentStatus] || statusColors.pending;
              return (
                <div
                  key={b._id}
                  className="grid grid-cols-6 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                >
                  <span className="text-sm text-white font-medium">{b.userId?.name || "—"}</span>
                  <span className="text-xs text-gray-400 truncate">{b.userId?.email || "—"}</span>
                  <span className="text-sm text-gray-200">{b.batchId?.title || "—"}</span>
                  <span className="text-xs text-gray-400">{b.batchId?.level || "—"}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${sc}`}>
                    {b.paymentStatus || "pending"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(b.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewBookings;