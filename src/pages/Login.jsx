import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e, role) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);

      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin/pegawai");
      } else {
        navigate("/pegawai");
      }

    } catch (err) {
      setError("Login gagal: " + err.message);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#f6f1f1]">
      {/* KIRI */}
      <div className="bg-white flex flex-col justify-center items-center p-6 relative">
        <img src="/InTress-KPPN-Liwa.png" className="absolute top-2 left-6 w-[150px]" />
        <img src="/logo-liwa-full.png" className="w-[650px]" />
      </div>

      {/* KANAN */}
      <div className="flex justify-center items-center bg-[#fff5f5] px-10">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-[#3b4e8a] mb-2">
            Login LIWA
          </h2>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={(e) => handleLogin(e, "admin")}
                className="w-full bg-[#3b4e8a] text-white py-2 rounded"
              >
                Login Admin
              </button>

              <button
                type="button"
                onClick={(e) => handleLogin(e, "pegawai")}
                className="w-full bg-[#27ae60] text-white py-2 rounded"
              >
                Login Pegawai
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
