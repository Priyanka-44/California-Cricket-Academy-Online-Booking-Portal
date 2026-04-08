import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, LayersIcon , CalendarCheck, } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import AdminHeader from "./AdminHeader";
import Footer from "../../components/Footer";

const BASE_URL = "https://california-cricket-academy-online.onrender.com/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const navigate  = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalCoaches: 0, totalBatches: 0, totalBookings: 0 });
  const [chartData, setChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin"); 

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Dashboard states
        const res = await axios.get(`${BASE_URL}/dashboard/admin`, { headers });
        const { totalUsers, totalCoaches, totalBatches, totalBookings, chartData } = res.data;
        setStats({ totalUsers, totalCoaches, totalBatches, totalBookings });
        setChart(chartData || []);

        //  Admin profile — real name fetch
        const profileRes = await axios.get(`${BASE_URL}/auth/profile`, { headers });
        setAdminName(profileRes.data.name || "Admin");

      } catch (err) {
        console.log(err);
      } finally { 
        setLoading(false); 
      }
    };
    fetchAll();
  }, []);

  const cards = [
    { 
      label: "Total Users",    
      value: stats.totalUsers,    
      icon: <Users/>, 
      color: "from-gray-600 to-emerald-500",  
      path: "/admin/users"    
    },
    { 
      label: "Total Coaches",  
      value: stats.totalCoaches,  
      icon: <UserCheck />, 
      color: "from-gray-600 to-blue-500",      
      path: "/admin/coaches"  
    },
    { 
      label: "Total Batches",  
      value: stats.totalBatches,  
      icon: <LayersIcon />, 
      color: "from-gray-600 to-purple-500",  
      path: "/admin/batches"  
    },
    { 
      label: "Total Bookings", 
      value: stats.totalBookings, 
      icon: <CalendarCheck />, 
      color: "from-gray-500 to-orange-500",  
      path: "/admin/bookings" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminHeader />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {adminName} 👋</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {cards.map((card) => (
                <div
                  key={card.label}
                  onClick={() => navigate(card.path)}
                  className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all group"
                >
                  <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-20 group-hover:opacity-30 blur-xl transition-opacity`} />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg mb-3`}>
                    {card.icon}
                  </div>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold text-white mb-6">Bookings per Batch</h2>
              {chartData.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-10">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="batch" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px", paddingTop: "16px" }} />
                    <Bar dataKey="enrolledStudents" name="Enrolled Students" fill="#16a34a"              radius={[4, 4, 0, 0]} />
                    <Bar dataKey="maxCapacity"      name="Max Capacity"      fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

