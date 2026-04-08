import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";
import Footer from "../../components/Footer";

const BASE_URL = "http://localhost:5000/api";

const ManageCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => { fetchCoaches(); fetchBatches(); }, []);

  const fetchCoaches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/coaches`);
      setCoaches(res.data);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/batches`, { headers });
      setBatches(res.data);
    }
    catch (err) {
      console.log(err);
    }
  };

  const getCoachBatches = (coachId) =>
    batches.filter((b) => b.coachId?.toString() === coachId?.toString());

  const removeCoach = async (id) => {
    if (!window.confirm("Do you want to remove the coach?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/coaches/${id}`, { headers });
      toast.success("The coach has been removed");
      fetchCoaches();
    }
    catch (err) {
      toast.error(err.response?.data?.message || "not removed");
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminHeader />
      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Coaches</h1>
            <p className="text-gray-400 text-sm mt-1">{coaches.length} total coaches</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading coaches...</div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-20 text-gray-400">right now no coach available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches.map((coach) => {
              const assignedBatches = getCoachBatches(coach._id);
              return (
                <div key={coach._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-white">
                      {coach.avatar
                        ? <img src={`http://localhost:5000${coach.avatar}`} alt="" className="w-full h-full rounded-xl object-cover" />
                        : getInitials(coach.name)
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{coach.name}</p>
                      <p className="text-xs text-gray-400">{coach.email}</p>
                    </div>
                  </div>

                  {/* Assigned Batches */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Assigned Batches</p>
                    {assignedBatches.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">no batch assigned</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {assignedBatches.map((b) => (
                          <span key={b._id} className="text-xs bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-full">
                            {b.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeCoach(coach._id)}
                    className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all cursor-pointer"
                  >🗑️ Remove Coach</button>
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

export default ManageCoaches;