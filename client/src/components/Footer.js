import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-white/10 pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
              CA
            </div>
            <span className="text-white font-bold text-lg">Cricket Academy</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            California Cricket Academy is dedicated to nurturing cricket talent and building future champions through professional training and guidance.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { 
                label: "Home",     
                path: "/" 
              },
              { 
                label: "Programs", 
                path: "/programs" 
              },
              { 
                label: "Contact",  
                path: "/contact" 
              },
              { 
                label: "Login",    
                path: "/login" 
              },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.path} className="text-gray-400 text-sm hover:text-green-400 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

       
        <div>
          <h3 className="text-white font-bold mb-4">Programs</h3>
          <ul className="space-y-2">
            {["Beginner Training", "Intermediate Coaching", "Advanced Programs", "Professional Training"].map((item) => (
              <li key={item}>
                <Link to="/programs" className="text-gray-400 text-sm hover:text-green-400 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-bold mb-4">Contact Info</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">📍</span> 123 Cricket Lane, CA 94016
            </li>
            <li className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">📞</span> +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-green-400">✉️</span> info@cricket.com
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            {[
              { 
                icon: "f", 
                href: "#" 
              },
              { 
                icon: "𝕏", 
                href: "#" },
              { 
                icon: "📷", 
                href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/40 transition-all text-sm cursor-pointer">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-gray-500 text-sm">© 2026 California Cricket Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;