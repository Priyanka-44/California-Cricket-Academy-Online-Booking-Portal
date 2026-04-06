import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [startDate, setStartDate] = useState("");
  const [emergency, setEmergency] = useState("");
  const [medical, setMedical] = useState("");

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/batches");
        const selected = res.data.find((b) => b._id === id);
        setBatch(selected);
      } 
      catch (err) 
      {
         console.log("error loading batch"); 
      }
    };
    fetchBatch();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { 
          batchId: id 
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      navigate(`/payment/${res.data.booking._id}`);
    } catch (err) {
      alert("Booking failed");
    }
  };

  if (!batch) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
      ⏳ Loading...
    </div>
  );

  const registrationFee = 500;
  const gst = Math.round(batch.fees * 0.18);
  const total = batch.fees + registrationFee + gst;

  const inputCls = "w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 transition-colors text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-center mb-2">Complete Your Booking</h1>
        <p className="text-center text-gray-400 mb-10 text-sm">Just a few more details and you're all set!</p>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT FORM */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 text-white">Personal Information</h2>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">Preferred Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">Emergency Contact</label>
                  <input type="text" value={emergency} onChange={(e) => setEmergency(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest">Medical Conditions (Optional)</label>
                <textarea value={medical} onChange={(e) => setMedical(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 resize-none text-sm"
                  rows={3} placeholder="Please mention any medical conditions" />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" required className="accent-green-500" />
                <p>I agree to the terms and conditions.</p>
              </div>

              <button type="submit"
                className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
                Proceed to Payment →
              </button>
            </form>
          </div>

          {/* RIGHT ORDER SUMMARY */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-5 text-white">Order Summary</h2>

            <div className="space-y-4 text-sm">
              {[
                { 
                  label: "Program", 
                  value: batch.title 
                },
                { 
                  label: "Skill Level", 
                  value: batch.level 
                },
                { 
                  label: "Age Group",
                  value: batch.ageGroup 
                },
                { 
                  label: "Coach", 
                  value: batch.coachName || "Assigned" 
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className="font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            <hr className="my-5 border-white/10" />

            <div className="space-y-2 text-sm">
              {[
                { 
                  label: "Monthly Fee", 
                  value: `₹${batch.fees}` 
                },
                { 
                  label: "Registration Fee", 
                  value: `₹${registrationFee}` 
                },
                { 
                  label: "GST (18%)", 
                  value: `₹${gst}` 
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-300">
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
            </div>

            <hr className="my-5 border-white/10" />

            <div className="flex justify-between font-bold text-lg text-white">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            <div className="mt-5 text-sm text-gray-400">
              <p className="mb-2 text-xs uppercase tracking-widest">Included Benefits</p>
              <ul className="space-y-1.5">
                {["Professional coaching", "Training equipment", "Performance tracking", "Certificate on completion"].map((b) => (
                  <li key={b} className="flex items-center gap-2"><span className="text-green-400 text-xs">●</span>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;