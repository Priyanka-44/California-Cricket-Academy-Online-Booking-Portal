import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GraduationCap, Baby, Clock, Users } from "lucide-react";
import axios from "axios";

const BASE_URL = "https://california-cricket-academy-online.onrender.com/api";


const bannerImages = {
  Beginner: "https://res.cloudinary.com/djaoro6z5/image/upload/v1775217486/5_xofxxj.jpg",
  Intermediate: "https://res.cloudinary.com/djaoro6z5/image/upload/v1775217497/7_b9ddae.jpg",
  Advanced: "https://res.cloudinary.com/djaoro6z5/image/upload/v1775217520/6_tfij4w.jpg",
};

const levelColors = {
  Beginner: "bg-blue-500 text-white",
  Intermediate: "bg-yellow-500 text-white",
  Advanced: "bg-red-500 text-white",
};

const barColors = {
  Beginner: "bg-yellow-400",
  Intermediate: "bg-yellow-400",
  Advanced: "bg-red-400",
};

const fallbackDesc = "Professional cricket training program designed to help students develop their skills and reach their full potential.";
const fallbackSchedule = "Mon, Wed, Fri · 4:00 PM to 6:00 PM";
const fallbackLearn = [
  "Fundamental cricket techniques",
  "Batting and bowling skills",
  "Match strategies and tactics",
  "Physical fitness and conditioning",
  "Team coordination and sportsmanship",
  "Video analysis and feedback",
];

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=/programs/${id}`);
    } else {
      navigate(`/booking/${id}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/batches`);
        const found = res.data.find((b) => b._id === id);
        setBatch(found || null);

        if (found?.coachId) {
          try {
            const coachRes = await axios.get(`${BASE_URL}/coaches`);
            const foundCoach = coachRes.data.find(
              (c) => c._id === (found.coachId?._id || found.coachId)
            );
            setCoach(foundCoach || null);
          } catch (e) { console.log("Coach fetch failed"); }
        }
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
      ⏳ Loading...
    </div>
  );

  if (!batch) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
      Program not found
    </div>
  );

  const pct = Math.round(((batch.enrolledStudents || 0) / (batch.slots || 20)) * 100);
  const seatsLeft = (batch.slots || 20) - (batch.enrolledStudents || 0);
  const lc = levelColors[batch.level] || levelColors.Beginner;
  const bc = barColors[batch.level] || barColors.Beginner;

  const description = batch.description || fallbackDesc;
  const schedule = batch.schedule || fallbackSchedule;
  const whatYouLearn = (batch.whatYouLearn && batch.whatYouLearn.length > 0)
    ? batch.whatYouLearn
    : fallbackLearn;

  const coachName = coach?.name || "Assigned Coach";
  const coachInitials = coachName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const coachEmail = coach?.email || "coach@cricketacademy.com";
  const coachAvatar = coach?.avatar || null;

  const bannerImg = bannerImages[batch.level] || bannerImages.Beginner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <button onClick={() => navigate("/programs")}
          className="text-gray-400 text-sm hover:text-white transition-colors mb-5 flex items-center gap-1 cursor-pointer">
          ‹ Back to Programs
        </button>

        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

          <div
            className="relative h-48 flex items-end p-5"
            style={{
              backgroundImage: `url('${bannerImg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >

            <div className="absolute inset-0 bg-black/55" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lc}`}>
                {batch.level}
              </span>
              {seatsLeft <= 5 && seatsLeft > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
                  Only {seatsLeft} spots left!
                </span>
              )}
              {seatsLeft <= 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-600 text-white">
                  Full
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white relative z-10">{batch.title}</h1>
          </div>

          <div className="p-6 space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-400">₹{batch.fees}</p>
                <p className="text-gray-400 text-sm">per month</p>
              </div>
              <button onClick={handleBookNow}
                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all cursor-pointer">
                Book Now
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  icon: <Baby size={16} />, 
                  label: "Age Group", 
                  value: batch.ageGroup 
                },
                { 
                  icon: <Clock size={16} />, 
                  label: "Schedule", 
                  value: schedule 
                },
                { 
                  icon: <GraduationCap size={16} />, 
                  label: "Skill Level", 
                  value: batch.level 
                },
                { 
                  icon: <Users size={16} />, 
                  label: "Capacity", 
                  value: `${batch.enrolledStudents || 0}/${batch.slots || 20} enrolled` 
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                    {icon} {label}
                  </p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Enrollment Status */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Enrollment Status</span>
                <span className="text-white font-semibold">{pct}% Full</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className={`h-2 rounded-full transition-all ${bc}`} style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-bold text-white mb-2">About This Program</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>

            {/* Coach */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Your Coach</h2>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-800 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 overflow-hidden">
                  {coachAvatar
                    ? <img src={`https://california-cricket-academy-online.onrender.com${coachAvatar}`} alt="coach" className="w-full h-full object-cover" />
                    : coachInitials
                  }
                </div>
                <div>
                  <p className="font-bold text-white">{coachName}</p>
                  <p className="text-green-400 text-sm">Cricket Coach</p>
                  <p className="text-gray-400 text-xs mt-0.5">{coachEmail}</p>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">What You'll Learn</h2>
              <div className="grid grid-cols-2 gap-2">
                {whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <span className="text-green-400 text-xs">●</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <button onClick={handleBookNow}
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all cursor-pointer text-lg">
              Proceed to Booking
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;

