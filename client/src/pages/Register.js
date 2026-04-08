import { useState } from "react";
import axios from "axios";
//import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("https://california-cricket-academy-online.onrender.com/api/auth/register", { name, email, phone, age, password, role });
      toast.success("Registration successful");
      navigate("/login");
    }
    catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const inputCls = "p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 transition-colors text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* HERO */}
      <div className="text-center pt-20 pb-10">
        <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">CA</div>
        <h1 className="text-4xl font-bold mt-4">Create Account</h1>
        <p className="text-gray-400 mt-1">Join the Cricket Academy today</p>
      </div>

      {/* REGISTER CARD */}
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 mb-12">
        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} />

          {/* ROLE SELECT */}
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="col-span-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-green-500/50 text-sm cursor-pointer">
            <option value="user" className="bg-gray-900">User</option>
            <option value="coach" className="bg-gray-900">Coach</option>
            <option value="admin" className="bg-gray-900">Admin</option>
          </select>

          <div className="col-span-2 flex items-center text-sm text-gray-400 gap-2">
            <input type="checkbox" className="accent-green-500" />
            I agree to the
            <span className="text-green-400 cursor-pointer">Terms and Conditions</span>
            and
            <span className="text-green-400 cursor-pointer ml-1">Privacy Policy</span>
          </div>

          <button type="submit"
            className="col-span-2 bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:text-green-300">Login here</Link>
        </p>
      </div>
      {/* <Footer/> */}
    </div>
  );
}

export default Register;