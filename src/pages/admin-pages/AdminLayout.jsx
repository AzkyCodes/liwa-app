import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, BarChart2, Award } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/pegawai", label: "Pegawai", icon: <User size={18} /> },
    { path: "/admin/capaian", label: "Capaian LO", icon: <BarChart2 size={18} /> },
    { path: "/admin/leaderboard", label: "Leaderboard", icon: <Award size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] shadow-lg p-6 flex flex-col justify-between">
        <div>
          <img src="/InTress-KPPN-Liwa.png" alt="Logo" className="w-36 mx-auto mb-10" />

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-[#3b4e8a] text-white shadow"
                    : "text-[#3b4e8a] hover:bg-blue-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 justify-center mt-10 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* KONTEN */}
      <main className="flex-1 p-8 overflow-y-auto bg-white shadow-inner rounded-l-2xl">
        <Outlet />
      </main>
    </div>
  );
}
