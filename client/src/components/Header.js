import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
   const getValidToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("token");
        return null;
      }
      return token;
    } catch (e) {
      localStorage.removeItem("token");
      return null;
    }
  };

  const token = getValidToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-r from-green-950 to-slate-950 px-6 py-3 flex justify-between items-center text-white">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-200 text-green-900 rounded-full flex items-center justify-center font-bold">
          CA
        </div>
        <h1 className="text-lg font-semibold">Cricket Academy</h1>
      </div>

      {/* NAV */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-green-300">Home</Link>
        <Link to="/programs" className="hover:text-green-300">Programs</Link>
        <Link to="/contact"  className="hover:text-green-300">Contact</Link>

        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-1.5 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold"
          >
            Logout
          </button>
        ) : (

          <button
            onClick={() => navigate("/login")}
            className="bg-gray-200 text-black px-4 py-1.5 rounded-lg hover:bg-gray-300 transition-all text-sm font-semibold"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;

