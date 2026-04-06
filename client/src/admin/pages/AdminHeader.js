import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, ChevronUp, ChevronDown } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { 
      label: "Dashboard", 
      path: "/admin/dashboard" 
    },
    { 
      label: "Batches",   
      path: "/admin/batches"   
    },
    { 
      label: "Coaches",   
      path: "/admin/coaches"   
    },
    { 
      label: "Users",     
      path: "/admin/users"     
    },
    { 
      label: "Bookings",  
      path: "/admin/bookings"  
    },
  ];

  return (
    <header className="w-full bg-gray-900/95 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center font-bold text-sm text-white">CA</div>
        <span className="text-white font-bold text-lg">Cricket Academy</span>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((item) => (
          <span key={item.label} onClick={() => navigate(item.path)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
              ${location.pathname === item.path
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
            {item.label}
          </span>
        ))}
      </nav>

      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/15 transition-all cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">A</div>
          <span>Admin</span>
          {open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
            <button onClick={() => { navigate("/admin/profile"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 transition-colors cursor-pointer">
              <User size={16} className="text-gray-400"/> Profile
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

export default AdminHeader;
