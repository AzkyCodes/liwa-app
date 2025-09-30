import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config"; // pastikan path sesuai

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      
      localStorage.setItem("isAdmin", true); 
      navigate("/admin/pegawai");
    } catch (err) {
      console.error(err);
      setError("Login gagal: " + err.message);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#f6f1f1]">
      {/* KIRI */}
      <div className="bg-white flex flex-col justify-center items-center p-6 relative">
        {/* Logo kecil pojok kiri */}
        <img src="/InTress-KPPN-Liwa.png" alt="Logo kecil" className="absolute top-2 left-6 w-[150px]" />
        {/* Logo besar tengah */}
        <img src="/logo-liwa-full.png" alt="Logo besar" className="w-[650px]" />
      </div>

      {/* KANAN */}
      <div className="flex flex-col justify-center items-center px-10 py-8 text-center bg-[#fff5f5]">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-[#3b4e8a] mb-1">Hello, Admin!</h2>
          <p className="text-md text-gray-600 mb-10">Let’s Login to Your Account</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-[#3b4e8a] mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded shadow focus:outline-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3b4e8a] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded shadow focus:outline-primary mb-5"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#3b4e8a] hover:bg-[#2c4da5] text-white font-bold py-2 rounded mt-5"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
