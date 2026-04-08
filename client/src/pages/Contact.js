import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://california-cricket-academy-online.onrender.com/api/contact", { name, email, message });
      toast.success("Message sent successfully");
      setName(""); setEmail(""); setMessage("");
    } 
    catch (err) {
      toast.error("Failed to send message");
    }
  };

  const inputCls = "w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500/50 transition-colors text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* HERO */}
      <div className="text-center py-16 px-6">
        <h1 className="text-4xl font-bold text-white">Contact Us</h1>
        <p className="text-gray-400 mt-2">Get in touch with us for any questions or inquiries</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 pb-20">

        {/* LEFT SIDE IMAGE */}
        <div className="flex items-center justify-center">
          <img src="/cricket-player.png" alt="cricket" className="w-full max-w-md" />
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-5 text-white">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            <textarea placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)}
              className={`${inputCls} h-32 resize-none`} />
            <button type="submit"
              className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
              Send Message
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default Contact;