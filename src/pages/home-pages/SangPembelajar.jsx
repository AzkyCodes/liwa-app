import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";

export default function SangPembelajar() {
  const [topLearner, setTopLearner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopLearner = async () => {
      const snapshot = await getDocs(collection(db, "leaderboard"));
      const data = snapshot.docs.map((doc) => {
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
        return { ...d, total };
      });

      // Urutkan descending berdasarkan total poin
      const sorted = data.sort((a, b) => b.total - a.total);
      setTopLearner(sorted[0]);
      setLoading(false);
    };

    fetchTopLearner();
  }, []);

  return (
    <section
      id="leaderboard"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff5f5] to-[#fcefcf] text-center px-4 py-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-20 text-[#d97706] tracking-wide drop-shadow-md"
      >
        👑 SANG PEMBELAJAR KPPN LIWA 👑
      </motion.h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : topLearner ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-white border-[4px] border-yellow-400 shadow-2xl rounded-2xl px-10 py-8 max-w-md w-full"
        >
          {/* Confetti efek dummy */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <div className="absolute w-3 h-3 bg-pink-400 rounded-full top-6 left-10 animate-bounce"></div>
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full top-16 right-10 animate-bounce delay-200"></div>
            <div className="absolute w-2 h-2 bg-green-400 rounded-full bottom-8 left-1/2 animate-ping"></div>
          </motion.div>

          {/* Mahkota Icon */}
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="absolute -top-6 left-2/4 -translate-x-1/2 bg-[#facc15] p-3 rounded-full shadow-lg z-10"
          >
            <FaCrown className="text-white text-3xl drop-shadow" />
          </motion.div>

          <div className="mt-8">
            <h4 className="text-2xl font-extrabold text-[#3b4e8a]">
              {topLearner.nama}
            </h4>
            <p className="text-sm text-gray-600">{topLearner.jabatan}</p>
            <p className="mt-3 text-2xl font-bold text-[#fb9302]">
              {topLearner.total} POIN
            </p>
            <p className="mt-2 text-xs text-gray-500 italic">
              Pegawai dengan semangat belajar tertinggi saat ini
            </p>
          </div>
        </motion.div>
      ) : (
        <p className="text-gray-400">Belum ada data leaderboard.</p>
      )}
    </section>
  );
}
