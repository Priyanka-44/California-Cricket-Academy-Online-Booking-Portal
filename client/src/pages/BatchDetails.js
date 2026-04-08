import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function BatchDetails() {

    const { id } = useParams();
    const [batch, setBatch] = useState(null);

    useEffect(() => {
        fetchBatch();
    }, []);

    const fetchBatch = async () => {

        try {

               const res = await axios.get("https://california-cricket-academy-online.onrender.com/api/batches");                                                              

            const selected = res.data.find(b => b._id === id);

            setBatch(selected);

        } catch (error) {
            console.log("error loading batch");
        }

    };

    if (!batch) return <p className="text-white p-10">Loading...</p>;

    const percent = (batch.enrolledStudents / batch.slots) * 100;

    return (

        <div className="bg-gradient-to-br from-green-900 via-blue-900 to-slate-900 min-h-screen text-white py-10">

            <div className="max-w-5xl mx-auto">

                <Link to="/programs" className="text-gray-300 mb-4 block">
                    ← Back to Programs
                </Link>


                {/* HERO IMAGE */}

                <div className="relative rounded-xl overflow-hidden mb-6">

                    <img
                        src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d"
                        className="w-full h-64 object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">

                        <div className="flex gap-2 mb-2">

                            <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                                {batch.level}
                            </span>

                            <span className="bg-red-500 px-3 py-1 rounded-full text-sm">
                                Only {batch.slots - batch.enrolledStudents} spots left
                            </span>

                        </div>

                        <h1 className="text-4xl font-bold">
                            {batch.title}
                        </h1>

                    </div>

                </div>


                {/* PRICE + BOOK BUTTON */}

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <p className="text-green-400 text-3xl font-bold">
                            ₹{batch.fees}
                        </p>

                        <p className="text-gray-300 text-sm">
                            per month
                        </p>

                    </div>

                    <Link to={`/booking/${batch._id}`}>

                        <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold">
                            Book Now
                        </button>

                    </Link>

                </div>


                {/* INFO GRID */}

                <div className="grid md:grid-cols-2 gap-4">

                    <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-gray-300">Age Group</p>
                        <p className="text-lg">{batch.ageGroup}</p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-gray-300">Schedule</p>
                        <p className="text-lg">Mon, Wed, Fri</p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-gray-300">Skill Level</p>
                        <p className="text-lg">{batch.level}</p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-gray-300">Capacity</p>
                        <p className="text-lg">
                            {batch.enrolledStudents}/{batch.slots} enrolled
                        </p>
                    </div>

                </div>


                {/* PROGRESS BAR */}

                <div className="mt-6">

                    <p className="mb-2 text-gray-300">
                        Enrollment Status
                    </p>

                    <div className="w-full bg-gray-700 rounded-full h-3">

                        <div
                            className="bg-yellow-400 h-3 rounded-full"
                            style={{ width: `${percent}%` }}
                        ></div>

                    </div>

                    <p className="text-right text-sm mt-1 text-gray-300">
                        {Math.round(percent)}% Full
                    </p>

                </div>


                {/* ABOUT */}

                <div className="mt-8">

                    <h2 className="text-2xl font-semibold mb-2">
                        About This Program
                    </h2>

                    <p className="text-gray-300">
                        Perfect for young cricketers starting their journey.
                        Focus on basic techniques, rules and building
                        confidence to perform in real matches.
                    </p>

                </div>


                {/* COACH */}

                <div className="mt-8">

                    <h2 className="text-2xl font-semibold mb-4">
                        Your Coach
                    </h2>

                    <div className="bg-white/10 p-4 rounded-xl flex items-center gap-4">

                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            className="w-16 h-16 rounded-full"
                        />

                        <div>

                            <h3 className="text-lg font-semibold">
                                {batch.coachName || "Professional Coach"}
                            </h3>

                            <p className="text-green-400 text-sm">
                                Batting Specialist
                            </p>

                            <p className="text-gray-400 text-sm">
                                10 years of coaching experience
                            </p>

                            <p className="text-gray-400 text-sm">
                                coach@cricketacademy.com
                            </p>

                        </div>

                    </div>

                </div>


                {/* WHAT YOU WILL LEARN */}

                <div className="mt-8">

                    <h2 className="text-2xl font-semibold mb-4">
                        What You'll Learn
                    </h2>

                    <div className="grid md:grid-cols-2 gap-3">

                        <div className="bg-white/5 p-3 rounded">
                            Fundamental cricket techniques
                        </div>

                        <div className="bg-white/5 p-3 rounded">
                            Batting and bowling skills
                        </div>

                        <div className="bg-white/5 p-3 rounded">
                            Match strategies and tactics
                        </div>

                        <div className="bg-white/5 p-3 rounded">
                            Physical fitness and conditioning
                        </div>

                        <div className="bg-white/5 p-3 rounded">
                            Team coordination and sportsmanship
                        </div>

                        <div className="bg-white/5 p-3 rounded">
                            Video analysis and feedback
                        </div>

                    </div>

                </div>


                {/* BOOK BUTTON */}

                <div className="text-center mt-10">

                    <Link to={`/booking/${batch._id}`}>

                        <button className="bg-green-700 hover:bg-green-800 px-8 py-3 rounded-full font-semibold">
                            Proceed to Booking
                        </button>

                    </Link>

                </div>


                {/* FOOTER */}

                <div className="mt-20 border-t border-white/10 pt-10 grid md:grid-cols-3 gap-6 text-gray-300 text-sm">

                    <div>

                        <h3 className="font-semibold mb-2">
                            Cricket Academy
                        </h3>

                        <p>
                            Professional cricket training for all age groups
                            and skill levels.
                        </p>

                    </div>

                    <div>

                        <h3 className="font-semibold mb-2">
                            Quick Links
                        </h3>

                        <p>Home</p>
                        <p>Programs</p>

                    </div>

                    <div>

                        <h3 className="font-semibold mb-2">
                            Contact
                        </h3>

                        <p>Email: info@cricketacademy.com</p>
                        <p>Phone: +91 98765 43210</p>
                        <p>Address: Mumbai, India</p>

                    </div>

                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    © 2026 Cricket Academy. All rights reserved.
                </p>

            </div>

        </div>

    );

}

export default BatchDetails;