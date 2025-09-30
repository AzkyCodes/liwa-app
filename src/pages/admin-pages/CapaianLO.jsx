import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";

// Master indikator capaian
const capaianMaster = [
  { komponen: "Knowledge Management Implementation", sub: "Subkomponen Pengorganisasian dan Penyebarluasan", maks: 110 },
  { komponen: "Learning Value Chain", sub: "Subkomponen Rencana Aksi Pembelajaran", maks: 100 },
  { komponen: "Learning Value Chain", sub: "Subkomponen Individual Development Plan (IDP)", maks: 200 },
  { komponen: "Learning Value Chain", sub: "Subkomponen Evaluasi Pembelajaran", maks: 100 },
  { komponen: "Learning Value Chain", sub: "Subkomponen Hard Competency Pegawai", maks: 100 },
  { komponen: "Learning Solutions", sub: "Subkomponen Structured Learning", maks: 100 },
  { komponen: "Learning Solutions", sub: "Subkomponen Learning from Experiences", maks: 100 },
  { komponen: "Learning Solutions", sub: "Subkomponen Pemenuhan Jam Pembelajaran (JP)", maks: 100 },
  { komponen: "Learners Performance", sub: "Subkomponen Organizational Performance", maks: 100 },
  { komponen: "Leaders Participation in Learning Process", sub: "Subkomponen Leaders as Teachers", maks: 100 },
  { komponen: "Leaders Participation in Learning Process", sub: "Subkomponen Leaders as Role Model", maks: 100 },
];

export default function AdminCapaianForm() {
  const [periode, setPeriode] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // default: 2025-07
  });
  const [nilai, setNilai] = useState(Array(11).fill(""));
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Proteksi halaman admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  // Ambil data capaian berdasarkan periode
  useEffect(() => {
    const fetchPeriode = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "capaianLO", periode));
        if (snap.exists()) {
          setNilai(snap.data().items || Array(11).fill(""));
        } else {
          setNilai(Array(11).fill(""));
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setStatus("❌ Gagal memuat data periode tersebut.");
      } finally {
        setLoading(false);
      }
    };
    fetchPeriode();
  }, [periode]);

  const handleChange = (index, value) => {
    const updated = [...nilai];
    updated[index] = value;
    setNilai(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = nilai.map((n) => parseInt(n, 10) || 0);
    const isValid = parsed.every((val, i) => val <= (capaianMaster[i]?.maks ?? 100));

    if (!isValid) {
      setStatus("❌ Nilai melebihi batas maksimal.");
      return;
    }

    try {
      await setDoc(doc(db, "capaianLO", periode), {
        items: parsed,
        updatedAt: new Date().toISOString(),
      });
      setStatus("✅ Data berhasil disimpan!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Gagal menyimpan data.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-xl border border-gray-100 mt-6">
      <h2 className="text-3xl font-bold text-center text-[#3b4e8a] mb-10 tracking-wide">
        📊 Form Capaian Learning Organization
      </h2>

      {/* Periode */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-semibold text-[#3b4e8a] w-24">Periode</label>
        <input
          type="month"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      {/* Status loading */}
      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">⏳ Memuat data capaian...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {nilai.map((val, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-4 border-b pb-4"
            >
              <div className="w-full md:w-2/3">
                <label className="block font-semibold text-lg md:text-xl text-[#3b4e8a]">
                  {i + 1}. {capaianMaster[i].komponen}
                </label>
                <p className="text-xs text-gray-600">{capaianMaster[i].sub}</p>
              </div>


              <div className="w-full md:w-1/3">
                <input
                  type="number"
                  min={0}
                  max={capaianMaster[i].maks}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Maks: {capaianMaster[i].maks}</p>
              </div>
            </div>
          ))}

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="bg-[#3b4e8a] hover:bg-[#2c4da5] text-white font-semibold py-2 px-6 rounded-md transition-all"
          >
            💾 Simpan Data
          </button>

          {/* Status Message */}
          {status && (
            <p
              className={`text-center text-sm font-semibold mt-4 transition-all ${
                status.includes("berhasil") ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      )}
    </div>

  );
}
