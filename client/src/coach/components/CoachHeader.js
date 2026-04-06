import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, User, LogOut, ChevronUp, ChevronDown } from "lucide-react";

const CoachHeader = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coach, setCoach] = useState({ name: "", avatar: "" });
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });
        setCoach({ name: res.data.name, avatar: res.data.avatar });
      } catch (err) { console.log(err); }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="bg-gradient-to-r from-green-950 to-slate-950 px-6 py-3 flex justify-between items-center text-white">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/coach/dashboard")}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center font-bold text-sm text-white">CA</div>
        <span className="text-white font-bold text-lg">Cricket Academy</span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        {[
          { 
            label: "Home",         
            path: "/"                
          },
          { 
            label: "Programs",     
            path: "/programs"        
          },
          { 
            label: "My Dashboard", 
            path: "/coach/dashboard" 
          },
        ].map((item) => (
          <span key={item.label} onClick={() => navigate(item.path)}
            className="text-white text-sm font-medium cursor-pointer hover:text-green-300 transition-colors">
            {item.label}
          </span>
        ))}
      </nav>

      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/15 transition-all cursor-pointer">
          {coach.avatar ? (
            <img src={`http://localhost:5000${coach.avatar}`} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-xs font-bold text-white">
              {getInitials(coach.name)}
            </div>
          )}
          <span>{coach.name || "Coach"}</span>
          {dropdownOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
            <button onClick={() => { navigate("/coach/profile"); setDropdownOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors cursor-pointer">
              <User size={16} className="text-gray-400"/> Profile
            </button>
            <button onClick={() => { navigate("/coach/dashboard"); setDropdownOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors cursor-pointer">
              <LayoutDashboard size={16} className="text-gray-400"/> Dashboard
            </button>
            <div className="border-t border-white/10" />
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
              <LogOut size={16}/> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CoachHeader;

