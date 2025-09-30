import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const location = useLocation();
  const activeStyle = "underline decoration-2 underline-offset-4";

  return (
    <header className="sticky top-0 z-50 bg-[#fff5f5] shadow-md py-2">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        {/* Kiri: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/InTress-KPPN-Liwa.png" alt="Logo LIWA" className="w-[150px] object-contain cursor-pointer" />
        </Link>

        {/* Tengah: Navigasi */}
        <nav className="relative font-medium text-sm hidden md:flex items-center space-x-6">
          {/* Dropdown LO */}
          <div className="relative group inline-block">
            <button className={`text-[#346ac6] font-bold ${location.pathname.includes("/lo") ? activeStyle : ""}`}>
              LO
            </button>
            <div className="absolute left-0 top-full mt-5 w-[170px] bg-white shadow-lg rounded-md border 
              opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all 
              duration-200 origin-top z-50">
              <Link to="/lo/capaian" className="text-[#346ac6] block px-4 py-1 hover:text-[#fb9302] font-semibold rounded-t-md transition">
                Capaian KPPN LIWA
              </Link>
              <Link to="/lo/monitoring" className="text-[#346ac6] block px-4 py-2 hover:text-[#fb9302] font-semibold rounded-t-md transition">
                Monitoring Pegawai
              </Link>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#fb9302] text-white text-xs rounded whitespace-nowrap
              opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
              transition-all duration-300 ease-out pointer-events-none z-50">
              Learning Organization
            </div>
          </div>

          {/* AI */}
          <div className="relative group inline-block">
            <Link to="/ai" className={`text-[#346ac6] font-bold ${location.pathname === "/ai" ? activeStyle : ""}`}>
              AI
            </Link>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#fb9302] text-white text-xs rounded whitespace-nowrap
              opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
              transition-all duration-300 ease-out pointer-events-none z-50">
              Aset Intelektual
            </div>
          </div>

          {/* ODOI */}
          <div className="relative group inline-block">
            <Link to="/odoi" className={`text-[#346ac6] font-bold ${location.pathname === "/odoi" ? activeStyle : ""}`}>
              ODOI
            </Link>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#fb9302] text-white text-xs rounded whitespace-nowrap
              opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
              transition-all duration-300 ease-out pointer-events-none z-50">
              One Day One Information
            </div>
          </div>

          {/* SL */}
          <div className="relative group inline-block">
            <Link to="/sl" className={`text-[#346ac6] font-bold ${location.pathname === "/sl" ? activeStyle : ""}`}>
              SL
            </Link>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#fb9302] text-white text-xs rounded whitespace-nowrap
              opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
              transition-all duration-300 ease-out pointer-events-none z-50">
              Self Learning
            </div>
          </div>

          {/* LEADERBOARD */}
          <div className="relative group inline-block">
            <Link to="/leaderboard" className={`text-[#346ac6] font-bold ${location.pathname === "/leaderboard" ? activeStyle : ""}`}>
              LEADERBOARD
            </Link>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#fb9302] text-white text-xs rounded whitespace-nowrap
              opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
              transition-all duration-300 ease-out pointer-events-none z-50">
              Peringkat Pegawai Aktif
            </div>
          </div>

        </nav>

        {/* Kanan: Login */}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#346ac6] font-bold text-white px-4 py-1.5 text-sm rounded-md"
          >
            Login
          </motion.button>
        </Link>
      </div>
    </header>
  );
}
