import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config"; // sesuaikan path

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeStyle = "underline decoration-2 underline-offset-4";

  const isLoggedIn = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("role");
      navigate("/login");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fff5f5] shadow-md py-2">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        
        {/* Kiri: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/InTress-KPPN-Liwa.png"
            alt="Logo LIWA"
            className="w-[150px] object-contain cursor-pointer"
          />
        </Link>

        {/* Tengah: Navigasi */}
        <nav className="relative font-medium text-sm hidden md:flex items-center space-x-6">
          {/* LO */}
          <div className="relative group inline-block">
            <button
              className={`text-[#346ac6] font-bold ${
                location.pathname.includes("/lo") ? activeStyle : ""
              }`}
            >
              LO
            </button>
            <div className="absolute left-0 top-full mt-5 w-[170px] bg-white shadow-lg rounded-md border 
              opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all 
              duration-200 origin-top z-50">
              <Link to="/lo/capaian" className="block px-4 py-2 text-[#346ac6] hover:text-[#fb9302] font-semibold">
                Capaian KPPN LIWA
              </Link>
              <Link to="/lo/monitoring" className="block px-4 py-2 text-[#346ac6] hover:text-[#fb9302] font-semibold">
                Monitoring Pegawai
              </Link>
            </div>
          </div>

          <Link to="/ai" className={`text-[#346ac6] font-bold ${location.pathname === "/ai" ? activeStyle : ""}`}>
            AI
          </Link>
          <Link to="/odoi" className={`text-[#346ac6] font-bold ${location.pathname === "/odoi" ? activeStyle : ""}`}>
            ODOI
          </Link>
          <Link to="/sl" className={`text-[#346ac6] font-bold ${location.pathname === "/sl" ? activeStyle : ""}`}>
            SL
          </Link>
          <Link
            to="/leaderboard"
            className={`text-[#346ac6] font-bold ${
              location.pathname === "/leaderboard" ? activeStyle : ""
            }`}
          >
            LEADERBOARD
          </Link>
        </nav>

        {/* Kanan: / Logout */}
        {isLoggedIn ? (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 font-bold text-white px-4 py-1.5 text-sm rounded-md"
          >
            Logout
          </motion.button>
        ) : (
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#346ac6] font-bold text-white px-4 py-1.5 text-sm rounded-md"
            >
              Login
            </motion.button>
          </Link>
        )}
      </div>
    </header>
  );
}
