import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import AdminHeader from "./AdminHeader";
import Footer from "../../components/Footer";

const BASE_URL = "http://localhost:5000/api";

const roleColors = {
  user: "bg-green-500/20 text-green-300 border-green-500/40",
  coach: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  admin: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/users`, { headers });
        setUsers(res.data);
      }
      catch (err) {
        toast.error("Users not loaded");
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Want to delete a user?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/admin/users/${id}`, { headers });
      toast.success("The user has been deleted");
      setUsers(users.filter((u) => u._id !== id));
    }
    catch (err) {
      toast.error("User not deleted");
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminHeader />
      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-gray-400 text-sm mt-1">{users.length} total users</p>
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500/50 min-w-[260px]"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No users found</div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 px-5 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Action</span>
            </div>

            {
              filtered.map((user) => {
                const rc = roleColors[user.role] || roleColors.user;
                return (
                  <div
                    key={user._id}
                    className="grid grid-cols-4 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user.avatar
                          ? <img src={`http://localhost:5000${user.avatar}`} alt="" className="w-full h-full rounded-xl object-cover" />
                          : getInitials(user.name)
                        }
                      </div>
                      <span className="text-sm text-white font-medium">{user.name}</span>
                    </div>

                    <span className="text-xs text-gray-400">{user.email}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border w-fit capitalize ${rc}`}>
                      {user.role}
                    </span>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="w-fit px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all cursor-pointer flex items-center gap-1"
                    > <Trash2 size={14} /> Delete </button>
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

export default Users;