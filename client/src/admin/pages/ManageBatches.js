import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Plus, Users, Baby, Clock, X, Save } from "lucide-react";
import { toast } from "react-toastify";
import AdminHeader from "./AdminHeader";
import Footer from "../../components/Footer";



const BASE_URL = "http://localhost:5000/api";

const levelColors = {
  Beginner: "bg-green-500/20 text-green-300 border-green-500/40",
  Intermediate: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Advanced: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const emptyForm = {
  title: "",
  ageGroup: "",
  level: "",
  fees: "",
  coachId: "",
  description: "",
  schedule: "",
  whatYouLearn: "",
};

const ManageBatches = () => {
  const [batches, setBatches] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => { fetchBatches(); fetchCoaches(); }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/batches`, { headers });
      setBatches(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCoaches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/coaches`, { headers });
      setCoaches(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.coachId) {
      toast.warning("Title and coach required!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        fees: Number(form.fees),
        whatYouLearn: form.whatYouLearn
          ? form.whatYouLearn.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editId) {
        await axios.put(`${BASE_URL}/batches/${editId}`, payload, { headers });
        toast.success("batch updated ");
      } else {
        await axios.post(`${BASE_URL}/batches`, payload, { headers });
        toast.success("New batch added ");
      }
      fetchBatches();
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error aaya");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch) => {
    setForm({
      title: batch.title,
      ageGroup: batch.ageGroup,
      level: batch.level,
      fees: batch.fees,
      coachId: batch.coachId || "",
      description: batch.description || "",
      schedule: batch.schedule || "",
      whatYouLearn: (batch.whatYouLearn || []).join(", "),
    });
    setEditId(batch._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Want to delete a batch?")) return;
    try {
      await axios.delete(`${BASE_URL}/batches/${id}`, { headers });
      toast.success("batch deleted");
      fetchBatches();
    } catch (err) {
      toast.error("Not Deleted");
    }
  };

  const handleBulkImport = async () => {
    if (!importFile) {
      toast.warning("Please select CSV / Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    setImportLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/batches/import`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Bulk import successful");
      fetchBatches();
      setImportFile(null);
    } catch (err) {
      toast.error("Import failed");
      console.log(err);
    } finally {
      setImportLoading(false);
    }
  };
  const inputCls =
    "bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500/50 transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminHeader />
      <div className="p-6 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Batches</h1>
            <p className="text-gray-400 text-sm mt-1">
              {batches.length} total batches
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setForm(emptyForm);
                setEditId(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              {showForm ? (
                <>
                  <X size={15} /> Cancel
                </>
              ) : (
                <>
                  <Plus size={15} /> Add Batch
                </>
              )}
            </button>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files[0])}
              className="text-sm text-white file:bg-blue-600 file:text-white file:border-0 file:px-3 file:py-2 file:rounded-lg"
            />

            <button
              onClick={handleBulkImport}
              disabled={importLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            >
              {importLoading ? "Importing..." : "Import CSV / Excel"}
            </button>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              {editId
                ? <><Pencil size={18} className="text-yellow-400" /> Edit Batch</>
                : <><Plus size={18} className="text-green-400" />Add New Batch</>
              }
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Batch Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />


              <div className="relative">
                <Baby size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Age Group — e.g. 8-12"
                  value={form.ageGroup}
                  onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                  className={`${inputCls} pl-9 w-full`}
                />
              </div>

              <input
                placeholder="Fees (₹)"
                type="number"
                value={form.fees}
                onChange={(e) => setForm({ ...form, fees: e.target.value })}
                className={inputCls}
              />

              <div className="relative">
                <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Schedule — e.g. Mon, Wed, Fri · 4:00 PM to 6:00 PM"
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className={`${inputCls} pl-9 w-full`}
                />
              </div>

              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500/50 cursor-pointer"
              >
                <option value="" className="bg-gray-900">Select Level</option>
                {["Beginner", "Intermediate", "Advanced"].map((l) => (
                  <option key={l} value={l} className="bg-gray-900">{l}</option>
                ))}
              </select>

              <select
                value={form.coachId}
                onChange={(e) => setForm({ ...form, coachId: e.target.value })}
                className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500/50 cursor-pointer"
              >
                <option value="" className="bg-gray-900">Select Coach</option>
                {coaches.map((c) => (
                  <option key={c._id} value={c._id} className="bg-gray-900">{c.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                Description
              </label>
              <textarea
                placeholder="Batch ke baare me likho..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className={`${inputCls} w-full resize-none`}
              />
            </div>

            {/* What You'll Learn */}
            <div className="mt-4">
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                What You'll Learn
                <span className="text-gray-500 ml-2 normal-case">(comma se alag karo)</span>
              </label>
              <textarea
                placeholder="Batting skills, Bowling techniques, Match strategies, Physical fitness, Team coordination"
                value={form.whatYouLearn}
                onChange={(e) => setForm({ ...form, whatYouLearn: e.target.value })}
                rows={2}
                className={`${inputCls} w-full resize-none`}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-5 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer
                ${loading
                  ? "bg-green-700/50 cursor-not-allowed text-green-300"
                  : "bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-90 text-white"
                }`}
            >
              {loading ? (
                "Saving..."
              ) : editId ? (
                <><Save size={15} /> Update Batch</>
              ) : (
                <><Plus size={15} /> Add Batch</>
              )}
            </button>
          </div>
        )}

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => {
            const pct = Math.round(((batch.enrolledStudents || 0) / (batch.slots || 20)) * 100);
            const lc = levelColors[batch.level] || levelColors.Beginner;

            return (
              <div
                key={batch._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all"
              >
                {/* Title + Level Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{batch.title}</h3>

                    <div className="flex items-center gap-1 mt-1">
                      <Baby size={12} className="text-white-400" />
                      <p className="text-xs text-white-100">{batch.ageGroup}</p>
                    </div>


                    {batch.schedule && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-white-500" />
                        <p className="text-xs text-white-500">{batch.schedule}</p>
                      </div>
                    )}

                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${lc}`}>
                    {batch.level}
                  </span>
                </div>

                {/* Students + Fees */}
                <div className="flex items-center justify-between text-xs text-white-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Users size={12} className="text-white-400" />
                    <span>{batch.enrolledStudents || 0} / {batch.slots || 20} students</span>
                  </div>
                  <span className="text-green-400 font-semibold">₹{batch.fees}</span>
                </div>

                {/* Enrollment Progress Bar */}
                <div className="h-1.5 bg-white/10 rounded-full mb-4">
                  <div
                    className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Edit + Delete Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/20 text-gray-300 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(batch._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageBatches;

