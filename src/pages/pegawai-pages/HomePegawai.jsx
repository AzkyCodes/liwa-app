import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function HomePegawai() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3b4e8a]">
              Selamat Datang di LIWA 👋
            </h1>
            <p className="text-gray-600">
              Platform Learning Organization KPPN Liwa
            </p>
          </div>

        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-5 border rounded-lg bg-[#eef2ff]">
            <h3 className="font-bold text-lg text-[#3b4e8a] mb-2">
              Learning Organization (LO)
            </h3>
            <p className="text-sm text-gray-700">
              Monitoring capaian dan pemenuhan dokumen LO pegawai.
            </p>
          </div>

          <div className="p-5 border rounded-lg bg-[#eef2ff]">
            <h3 className="font-bold text-lg text-[#3b4e8a] mb-2">
              Aset Intelektual
            </h3>
            <p className="text-sm text-gray-700">
              Kumpulan karya, buku, dan hasil pembelajaran pegawai.
            </p>
          </div>

          <div className="p-5 border rounded-lg bg-[#eef2ff]">
            <h3 className="font-bold text-lg text-[#3b4e8a] mb-2">
              One Day One Information (ODOI)
            </h3>
            <p className="text-sm text-gray-700">
              Catatan informasi dan pembelajaran harian pegawai.
            </p>
          </div>

          <div className="p-5 border rounded-lg bg-[#eef2ff]">
            <h3 className="font-bold text-lg text-[#3b4e8a] mb-2">
              Leaderboard
            </h3>
            <p className="text-sm text-gray-700">
              Peringkat pembelajar aktif berdasarkan total poin.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
