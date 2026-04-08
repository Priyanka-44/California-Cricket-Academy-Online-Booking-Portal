import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

const BASE_URL = "http://localhost:5000/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Step 1: Email check ──────────────────────────────────────────────────
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/check-email`, { email });
      toast.success("Email found! Set your new password.");
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "User not found") {
        toast.error("No account found with this email. Please register first.");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Reset password ───────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill both fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/reset-password`, { email, newPassword });
      toast.success("Password updated successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 transition-colors text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Hero */}
      <div className="text-center pt-20 pb-10">
        <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">CA</div>
        <h1 className="text-4xl font-bold mt-4">Forgot Password</h1>
        <p className="text-gray-400 mt-1">
          {step === 1
            ? "Enter your registered email to reset password"
            : "Set your new password"
          }
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${step >= 1 ? "bg-green-500 text-white" : "bg-white/10 text-gray-400"}`}>
            1
          </div>
          <div className={`flex-1 h-0.5 transition-all ${step >= 2 ? "bg-green-500" : "bg-white/10"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${step >= 2 ? "bg-green-500 text-white" : "bg-white/10 text-gray-400"}`}>
            2
          </div>
        </div>

        {/* Email  */}
        {step === 1 && (
          <form onSubmit={handleEmailCheck} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest">
                Registered Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-white transition-all cursor-pointer"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {/* New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">

            {/* Email — readonly */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className={`${inputCls} pl-9 opacity-50 cursor-not-allowed`}
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest">New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={`${inputCls} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`${inputCls} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Password match indicator */}
            {confirmPassword && (
              <p className={`text-xs ${newPassword === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-white transition-all cursor-pointer"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setNewPassword(""); setConfirmPassword(""); }}
              className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer mt-1"
            >
              <ArrowLeft size={14} /> Change Email
            </button>
          </form>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-green-400 hover:text-green-300">Login here</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;