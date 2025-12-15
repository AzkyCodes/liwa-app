import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SangPembelajar from "./home-pages/SangPembelajar";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { db } from "../firebase/config";

export default function Home() {
  const [nilaiCapaian, setNilaiCapaian] = useState([]);
  const [totalNilai, setTotalNilai] = useState(0);
  const [totalMaks, setTotalMaks] = useState(1210);
  const [rataRata, setRataRata] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "capaianLO"), orderBy("updatedAt", "desc"), limit(1));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docSnap = snap.docs[0];
          const data = docSnap.data().items || [];
          setNilaiCapaian(data);
          const total = data.reduce((sum, n) => sum + n, 0);
          setTotalNilai(total);
          if (data.length > 0) {
              const rata = total / data.length;
              setRataRata(rata.toFixed(2));
            } else {
              setRataRata(0);
            }
        }
      } catch (error) {
        console.error("Gagal mengambil data capaian LO:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="font-sans bg-[#e5dfeb] text-gray-800 scroll-smooth">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#fff5f5] shadow-md py-2">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          {/* Kiri: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/InTress-KPPN-Liwa.png" alt="Logo LIWA" className="w-[150px] object-contain cursor-pointer" />
          </Link>

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

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#fff5f5] overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-16 right-0 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse delay-200"></div>

        <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
          {/* Logo Kiri */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src="/logo-liwa.png"
              alt="Logo Literasi dan Wawasan"
              className="w-full max-w-lg object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </motion.div>

          {/* Teks Kanan */}
          <motion.div
            className="text-center md:text-left space-y-4"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img src="/liwa.png" alt="Teks LIWA" className="w-full max-w-md mx-auto md:mx-0 object-contain" />
            <p className="text-lg text-[#982722] px-5 md:px-0 max-w-xl leading-relaxed text-justify">
              <span className="font-bold text-[#fb923c]">Literasi dan Wawasan (LIWA)</span> adalah platform untuk mendukung
              pegawai KPPN Liwa dalam mengakses aset intelektual berbasis audio, visual, dan audiovisual secara cepat dan mudah.
            </p>
            <p className="text-md text-[#982722] px-5 md:px-0 max-w-xl leading-relaxed text-justify">
              LIWA mendorong peningkatan literasi, informasi, dan kinerja pegawai melalui <span className="font-bold text-[#fb923c]">aktivitas harian</span>,
              <span className="font-bold text-[#fb923c]"> berbagi pengetahuan</span>, dan <span className="font-bold text-[#fb923c]">pengembangan diri</span>.
            </p>
          </motion.div>
        </div>
</section>


      {/* SANG PEMBELAJAR */}
      <SangPembelajar />

      {/* CAPAIAN LO */}
      <section
        id="lo"
        className="min-h-screen flex flex-col items-center justify-center bg-[#f4eded] text-center px-4 py-12"
      >
        <motion.h3
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-[#7f1d1d] mb-20 tracking-wide"
        >
          RATA-RATA CAPAIAN LO KPPN LIWA
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-50 h-50"
        >
          <CircularProgressbar
            value={parseFloat(rataRata)}
            text={`${rataRata}`}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: "#eebd3e",
              textColor: "#7f1d1d",
              trailColor: "#e5e7eb",
              textSize: "20px",
            })}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-xl text-[#7f1d1d] font-medium"
        >
          Total Capaian:{" "}
          <span className="font-bold text-[#fb923c]">{totalNilai}</span> dari{" "}
          <span className="font-extrabold text-[#7f1d1d]">{totalMaks}</span> poin
        </motion.p>
      </section>


      {/* ASET & ODOI */}
      <section className="min-h-screen flex items-center justify-center bg-[#fff5f5] px-6 py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12">
          <motion.div
            id="ai"
            className="text-center md:text-left flex flex-col items-center md:items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img src="/aset-home.png" alt="Aset Intelektual" className="w-full max-w-md mb-4" />
            <p className="text-xl text-[#7f1d1d] leading-relaxed text-justify max-w-md">
              Akses mudah dan cepat ke berbagai aset intelektual KPPN Liwa dalam format audio, visual, dan audiovisual.
              LiWa hadir untuk mendukung setiap pegawai dalam meningkatkan literasi dan wawasan demi kinerja yang lebih baik.
            </p>
          </motion.div>

          <motion.div
            id="odoi"
            className="text-center md:text-right flex flex-col items-center md:items-end"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <img src="/odoi-home.png" alt="One Day One Information" className="w-full max-w-md mb-4" />
            <p className="text-xl text-[#7f1d1d] leading-relaxed text-justify max-w-md">
              Pegawai berbagi informasi penting setiap hari untuk meningkatkan literasi dan wawasan secara konsisten
              dan berkelanjutan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#eebd3e] text-center py-6">
        <p className="text-sm text-[#982722] font-bold">
          © {new Date().getFullYear()} LIWA - Literasi dan Wawasan
        </p>
      </footer>
    </div>
  );
}
