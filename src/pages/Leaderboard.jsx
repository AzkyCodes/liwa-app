import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Layout from "../components/Layout";
import { FaCrown } from "react-icons/fa";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "leaderboard"));
      const results = [];

      querySnapshot.forEach((doc) => {
        const d = doc.data();
        const total =
          (d.ai || 0) +
          (d.jamlat || 0) +
          (d.klc || 0) +
          (d.sl || 0) +
          (d.odoi || 0) +
          (d.prestasi || 0) +
          (d.hc || 0) +
          (d.literasi || 0);
        results.push({ ...d, total });
      });

      results.sort((a, b) => b.total - a.total);
      setData(results);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getRankStyle = (index) => {
    if (index === 0) return "bg-yellow-300 text-white";
    if (index === 1) return "bg-gray-300 text-white";
    if (index === 2) return "bg-orange-300 text-white";
    return "bg-[#eef2ff]";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-center text-2xl font-bold text-[#3b4e8a] mb-6">
          LEADERBOARD PEMBELAJAR AKTIF
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data leaderboard.</p>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center px-4 py-3 rounded shadow ${getRankStyle(index)}`}
              >
                <div className="flex items-center gap-3">
                  {index < 3 && (
                    <FaCrown
                      className={`text-xl ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : "text-orange-400"
                      }`}
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-[#3b4e8a]">
                      #{index + 1} {item.nama}
                    </h3>
                    <p className="text-sm text-gray-700">{item.jabatan}</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-[#3b4e8a]">
                  {item.total.toLocaleString()} Poin
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
