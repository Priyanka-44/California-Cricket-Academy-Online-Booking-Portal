import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserHeader from "./UserHeader";
import Footer from "../../components/Footer";
import { User, Mail, Phone, MapPin, ImagePlus, Pencil, Save, X } from "lucide-react";

const BASE_URL = "http://localhost:5000";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "", avatar: "", role: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/profile`, { headers });
        setProfile(res.data);
      } catch (err) { toast.error("Profile not loaded"); }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone || "");
      formData.append("address", profile.address || "");
      if (imageFile) formData.append("avatar", imageFile);

      const res = await axios.put(`${BASE_URL}/api/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setPreview(null); setImageFile(null); setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Update failed");
    } finally { setLoading(false); }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarSrc = preview ? preview : profile.avatar ? `${BASE_URL}${profile.avatar}` : null;

  const fields = [
    {
      label: "Full Name",
      key: "name",
      type: "text",
      icon: <User size={14} />,
      disabled: false
    },
    {
      label: "Email Address",
      key: "email",
      type: "email",
      icon: <Mail size={14} />,
      disabled: true
    },
    {
      label: "Phone Number",
      key: "phone",
      type: "text",
      icon: <Phone size={14} />,
      disabled: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <UserHeader />
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl overflow-hidden border border-white/10">

          {/* Banner */}
          <div className="bg-gradient-to-r  from-gray-800 to-gray-700 px-6 py-8 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-green-800 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                : getInitials(profile.name)
              }
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.name || "User"}</h2>
              <p className="text-green-200 text-sm mt-1 capitalize">{profile.role || "User"}</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Profile Information</h3>
              {!editing && (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer">
                  <Pencil size={14} /> Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-5">
              {fields.map(({ label, key, type, icon, disabled }) => (
                <div key={key}>
                  <label className="text-xs  text-green-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    {icon} {label}
                  </label>
                  <input
                    type={type}
                    value={profile[key] || ""}
                    disabled={disabled || !editing}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                      ${editing && !disabled
                        ? "bg-white/10 border border-white/20 text-white"
                        : "bg-white/5 border border-white/10 text-gray-300 cursor-default"
                      }`}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs  text-green-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={14} /> Address
                </label>
                <textarea
                  value={profile.address || ""}
                  disabled={!editing}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all
                    ${editing
                      ? "bg-white/10 border border-white/20 text-white"
                      : "bg-white/5 border border-white/10 text-gray-300 cursor-default"
                    }`}
                />
              </div>

              {editing && (
                <div>
                  <label className="text-xs  text-green-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <ImagePlus size={14} /> Profile Photo
                  </label>
                  <input type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} className="hidden" />
                  <div className="flex items-center gap-4">
                    {avatarSrc && <img src={avatarSrc} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-white/20" />}
                    <button onClick={() => fileRef.current.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-gray-300 text-sm hover:bg-white/10 transition-all cursor-pointer">
                      <ImagePlus size={14} /> Choose Image
                    </button>
                    {imageFile && <span className="text-xs text-green-400 truncate max-w-[140px]">{imageFile.name}</span>}
                  </div>
                </div>
              )}

              {editing && (
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer
                      ${loading ? "bg-green-700/50 cursor-not-allowed text-green-300" : "bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-90 text-white"}`}>
                    <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => { setEditing(false); setPreview(null); setImageFile(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-white/20 text-gray-300 hover:bg-white/5 transition-all cursor-pointer">
                    <X size={15} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

