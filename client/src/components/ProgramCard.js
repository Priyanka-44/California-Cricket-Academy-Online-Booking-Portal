import { Link } from "react-router-dom";

function ProgramCard({ id, title, age, level, fees }) {

    return (

        <div className="bg-white/5 rounded-xl p-6 backdrop-blur-lg border border-white/10">

            <div className="flex justify-between mb-3">

                <h3 className="text-xl font-semibold">{title}</h3>

                <span className="text-xs bg-yellow-500 px-2 py-1 rounded">
                    {level}
                </span>

            </div>

            <p className="text-gray-300 text-sm mb-3">
                Perfect for cricketers looking to improve their game
            </p>

            <div className="text-sm text-gray-300 space-y-1 mb-3">

                <p>👥 Age: {age}</p>

                <p>🕒 Mon Wed Fri</p>

                <p>🏏 Professional Coaching</p>

            </div>

      

            <div className="h-2 bg-gray-700 rounded mb-3">
                <div className="h-2 bg-yellow-400 w-2/3 rounded"></div>
            </div>

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-green-400 text-2xl font-bold">
                        ₹{fees}
                    </p>

                    <p className="text-sm text-gray-400">
                        per month
                    </p>

                </div>

                <Link
                    to={`/program/${id}`}
                    className="text-green-400 font-semibold"
                > View Details → </Link>
            </div>
        </div>

    )

}

export default ProgramCard;