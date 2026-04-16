import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Users, Clock, GraduationCap } from "lucide-react";

const BASE_URL = "http://localhost:5000/api";

const levelColors = {
  Beginner: {
    badge: "bg-blue-500 text-white",
    bar: "bg-yellow-400",
  },
  Intermediate: {
    badge: "bg-yellow-500 text-white",
    bar: "bg-yellow-400",
  },
  Advanced: {
    badge: "bg-red-500 text-white",
    bar: "bg-red-400",
  },
};

const dummyDesc = {
  Beginner: "Perfect for young cricketers starting their journey. Focus on basic techniques, rules, and building confidence.",
  Intermediate: "Advanced techniques for players looking to improve their game. Includes video analysis and tactical training.",
  Advanced: "Master the art with professional techniques. Covers pace, spin, variations, and competitive match preparation.",
};

const dummySchedule = {
  Beginner: "Mon, Wed, Fri · 4:00 PM to 6:00 PM",
  Intermediate: "Tue, Thu, Sat · 5:00 PM to 7:00 PM",
  Advanced: "Mon, Wed, Fri · 6:00 PM to 8:00 PM",
};

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [levelFilter, setLevelFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/batches`);
        setPrograms(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.log("error fetching programs");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    let data = [...programs];
    if (levelFilter !== "All") data = data.filter((p) => p.level === levelFilter);
    if (ageFilter !== "All") data = data.filter((p) => p.ageGroup === ageFilter);
    setFiltered(data);
  }, [levelFilter, ageFilter, programs]);

  const uniqueAges = ["All", ...new Set(programs.map((p) => p.ageGroup))];
  const levels = [
    "All",
    ...new Set(programs.map((p) => p.level).filter(Boolean)),
  ];
  const btn = (active) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer
    ${active
      ? "bg-green-500 border-green-500 text-white"
      : "bg-transparent border-white/20 text-gray-300 hover:border-white/40"
    }`;

  const handleViewDetails = (programId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login first to view & enroll in programs!", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    navigate(`/programs/${programId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Hero */}
      <div className="text-center py-14 px-6">
        <h1 className="text-5xl font-bold text-white mb-3">Our Training Programs</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Choose from our comprehensive range of programs designed for all age groups and skill levels
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap gap-8">

          <div>
            <p className="text-xs text-gray-400 mb-3">Age Group</p>
            <div className="flex gap-2 flex-wrap">
              {uniqueAges.map((age) => (
                <button key={age} onClick={() => setAgeFilter(age)} className={btn(ageFilter === age)}>
                  {age === "All" ? "All Ages" : age}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-3">Skill Level</p>
            <div className="flex gap-2 flex-wrap">
              {levels.map((lvl) => (
                <button key={lvl} onClick={() => setLevelFilter(lvl)} className={btn(levelFilter === lvl)}>
                  {lvl === "All" ? "All Levels" : lvl}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20 text-gray-400">⏳ Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Koi program nahi mila</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((program) => {
              const lc = levelColors[program.level] || levelColors.Beginner;
              const pct = Math.round(((program.enrolledStudents || 0) / (program.slots || 20)) * 100);

              return (
                <div
                  key={program._id}
                  className="bg-gray-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between min-h-[430px] hover:border-green-500/30 transition-all"
                >
                  {/* Title + Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-lg leading-tight">{program.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${lc.badge}`}>
                      {program.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {program.description || dummyDesc[program.level] || dummyDesc.Beginner}
                  </p>

                  {/* Meta — lucide icons */}
                  <div className="space-y-1.5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-gray-500 flex-shrink-0" />
                      <span>Age: {program.ageGroup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-gray-500 flex-shrink-0" />
                      <span>{program.schedule || dummySchedule[program.level] || dummySchedule.Beginner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={13} className="text-gray-500 flex-shrink-0" />
                      <span>Coach: Assigned</span>
                    </div>
                  </div>

                  {/* Enrollment bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Enrollment</span>
                      <span>{program.enrolledStudents || 0}/{program.slots || 20} students</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div className={`h-1.5 rounded-full ${lc.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Footer — price + view details */}
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="text-green-400 font-bold text-xl">₹{program.fees}</p>
                      <p className="text-gray-500 text-xs">per month</p>
                    </div>

                    <button
                      onClick={() => handleViewDetails(program._id)}
                      className="flex items-center gap-1 text-green-400 text-sm font-semibold hover:text-green-300 transition-colors cursor-pointer"
                    >
                      View Details <span>›</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;

