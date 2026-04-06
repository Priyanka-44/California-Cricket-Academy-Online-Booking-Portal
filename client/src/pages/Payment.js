import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaQrcode, FaCreditCard } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";


const SCANNER_MODE = "dummy"; // "dummy" 
const YOUR_UPI_ID = "yourname@upi"; //  UPI ID 

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [booking, setBooking] = useState(null);

  // Real fees booking se fetch karein
  const [fees, setFees] = useState({ programFee: 0, registration: 500, gst: 0, total: 0 });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/user",
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });

        const found = res.data.find((b) => b._id === id);
        if (found) {
          setBooking(found);
          const programFee = found.batchId?.fees || 3000;
          const registration = 500;
          const gst = Math.round(programFee * 0.18);
          const total = programFee + registration + gst;
          setFees({ programFee, registration, gst, total });
        }
      } catch (err) { console.log(err); }
    };
    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/bookings/payment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Payment Successful! ✅");
      navigate(`/confirmation/${id}`);
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  // QR URL 
  const qrUrl = SCANNER_MODE === "real"
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${YOUR_UPI_ID}&am=${fees.total}&cu=INR`
    : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=demo@upi&am=${fees.total}&cu=INR`;

  const inputCls = "w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 text-sm";

  const tabCls = (active) =>
    `p-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all text-sm font-medium
    ${active ? "border-green-500 bg-green-500/20 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/25"}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-center mb-2">Complete Payment</h1>
        <p className="text-center text-gray-400 mb-10 text-sm">Choose your preferred payment method</p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT PAYMENT CARD */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl">
            <h2 className="text-lg font-bold mb-6 text-white">Select Payment Method</h2>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-4 mb-8">

              <button onClick={() => setMethod("upi")} className={tabCls(method === "upi")}>
                <MdPhoneIphone size={24} /> UPI
              </button>

              <button onClick={() => setMethod("qr")} className={tabCls(method === "qr")}>
                <FaQrcode size={22} /> QR Code
              </button>

              <button onClick={() => setMethod("card")} className={tabCls(method === "card")}>
                <FaCreditCard size={22} /> Card
              </button>

            </div>

            {/* UPI */}
            {method === "upi" && (
              <div>

                <label className="text-xs text-gray-400 uppercase tracking-widest">UPI ID</label>
                <input type="text" placeholder="yourname@upi" className={`${inputCls} mt-2`} />

                <div className="bg-blue-900/20 border border-blue-500/20 text-sm p-3 mt-4 rounded-xl text-gray-300">
                  You will receive a payment request on your UPI app. Please approve it to complete the transaction.
                </div>

                <button onClick={handlePayment}
                  className="w-full mt-6 bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
                  Pay ₹{fees.total}
                </button>

              </div>
            )}

            {/* QR Code */}
            {method === "qr" && (
              <div className="text-center">
                
                <img src={qrUrl} alt="QR Code" className="mx-auto rounded-xl border border-white/10 p-2 bg-white" />
                {SCANNER_MODE === "dummy" && (
                  <p className="text-xs text-yellow-400 mt-2">⚠️ Dummy QR </p>
                )}
                
                <p className="mt-4 font-bold text-white text-lg">Scan to Pay ₹{fees.total}</p>
                <p className="text-gray-400 text-sm">Scan this QR code using any UPI app to complete your payment</p>
                
                <div className="bg-blue-900/20 border border-blue-500/20 text-sm p-3 mt-4 rounded-xl text-gray-300">
                  After completing payment, click the button below to proceed
                </div>
               
                <button onClick={handlePayment}
                  className="w-full mt-6 bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
                  I've Completed Payment
                </button>

              </div>
            )}

            {/* Card */}
            {method === "card" && (
             
             <div className="space-y-4">
                <input type="text" placeholder="1234 5678 9012 3456" className={inputCls} />
                <input type="text" placeholder="Cardholder Name" className={inputCls} />
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className={inputCls} />
                  <input type="text" placeholder="CVV" className={inputCls} />
                </div>
               
                <div className="bg-green-900/20 border border-green-500/20 text-sm p-3 rounded-xl text-gray-300">
                  Your payment information is secure and encrypted
                </div>
               
                <button onClick={handlePayment}
                  className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
                  Pay ₹{fees.total}
                </button>

              </div>
            )}

            <p className="text-center text-gray-500 text-xs mt-6">Secure Payment • SSL Encrypted</p>
          </div>

          {/* RIGHT PAYMENT SUMMARY */}
          <div className="bg-green-800/40 border border-green-500/30 p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-6 text-white">Payment Summary</h2>

            <div className="space-y-3 text-sm">
              {[
                { 
                  
                  label: "Program Fee", 
                  value: `₹${fees.programFee}` 
                },
                { 
                  
                  label: "Registration", 
                  value: `₹${fees.registration}` 
                },
                { 
                  label: "GST (18%)", 
                  value: `₹${fees.gst}` 
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-300">
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
            </div>

            <hr className="my-5 border-white/10" />

            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total Amount</span>
              <span>₹{fees.total}</span>
            </div>

            <div className="bg-green-900/40 border border-green-500/20 p-3 rounded-xl mt-5 text-sm">
              <p className="text-gray-400 text-xs mb-1">Booking ID</p>
              <p className="font-mono text-white text-xs break-all">booking-{id}</p>
            </div>

            <ul className="text-sm mt-5 space-y-2 text-green-300">
              {["Instant confirmation", "Email receipt", "100% secure payment"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-400">✔</span> {item}
                </li>
              ))}
            </ul>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;