import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/user/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");

      const role = res.data.role;

      if (role === "admin")
        navigate("/admin/dashboard");
      else if (role === "coach")
        navigate("/coach/dashboard");
      else
        //navigate("/user/dashboard");
        navigate(redirect);
    } catch (err) {

      // Backend ka exact message 
      const msg = err.response?.data?.message;

      if (msg === "User not found") {
    
        toast.error("No account found. Please register first!", {
          position: "top-center",
          autoClose: 4000,
        });
      } else if (msg === "Invalid password") {
        toast.error("Wrong password. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const inputCls = "w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 transition-colors text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* HERO */}
      <div className="text-center pt-20 pb-10">
        <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">CA</div>
        <h1 className="text-4xl font-bold mt-4">Welcome Back</h1>
        <p className="text-gray-400 mt-1">Login to your Cricket Academy account</p>
      </div>

      {/* LOGIN CARD */}
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8">

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com" className={inputCls} />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className={inputCls} />
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-green-500" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-green-400 hover:text-green-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button type="submit"
            className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-5 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 hover:text-green-300">Register here</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;