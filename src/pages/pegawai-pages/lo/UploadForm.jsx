import Layout from "../../../components/Layout";
import { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import { collection, getDocs, setDoc, doc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const periodeDokumen = {
  "Triwulan I": ["AI", "Jurnal"],
  "Triwulan II": ["AI", "Jurnal"],
  "Triwulan III": ["AI", "Jurnal"],
  "Triwulan IV": ["AI", "Jurnal"],
  "Semester I": ["CNC", "IDP", "BUKTI IDP"],
  "Semester II": ["CNC", "IDP", "BUKTI IDP"],
  "Tahunan": ["AI", "Learning from experiences", "Leader as a teacher"]
};

export default function UploadForm() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [selectedNama, setSelectedNama] = useState("");
  const [periode, setPeriode] = useState("Triwulan I");
  const [jenis, setJenis] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPegawai = async () => {
      const data = await getDocs(collection(db, "pegawai"));
      const result = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPegawaiList(result);
    };
    fetchPegawai();
  }, []);

  // ambil jabatan dari pilihan nama
  const jabatan = pegawaiList.find((p) => p.nama === selectedNama)?.jabatan || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNama || !periode || !jenis || !link) {
      alert("Lengkapi semua data!");
      return;
    }

    setLoading(true);

    try {
      const docId = `${selectedNama}-${periode}-${jenis}`;
      const docRef = doc(db, "lo_upload", docId);

      await setDoc(docRef, {
        nama: selectedNama,
        jabatan,
        periode,
        jenis,
        link,
        timestamp: Timestamp.now()
      });

      setSuccess(true);
      setLink("");
    } catch (err) {
      alert("Gagal upload: " + err.message);
    }

    setLoading(false);
  };


  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-6 bg-white shadow rounded-xl mt-10">
        <h1 className="text-2xl font-bold text-center text-[#346ac6] mb-6">
          Form Upload Dokumen LO
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-base">
          {/* NAMA */}
          <div>
            <label className="block font-medium mb-1">Nama Pegawai</label>
            <select
              value={selectedNama}
              onChange={(e) => setSelectedNama(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            >
              <option value="">-- Pilih Nama --</option>
              {pegawaiList.map((p) => (
                <option key={p.id} value={p.nama}>{p.nama}</option>
              ))}
            </select>
          </div>

          {/* JABATAN */}
          <div>
            <label className="block font-medium mb-1">Jabatan</label>
            <input
              type="text"
              value={jabatan}
              readOnly
              className="w-full border rounded px-4 py-2 bg-gray-100"
            />
          </div>

          {/* PERIODE */}
          <div>
            <label className="block font-medium mb-1">Periode</label>
            <select
              value={periode}
              onChange={(e) => {
                setPeriode(e.target.value);
                setJenis(""); // reset jenis dokumen saat periode berubah
              }}
              className="w-full border rounded px-4 py-2"
              required
            >
              {Object.keys(periodeDokumen).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* JENIS */}
          <div>
            <label className="block font-medium mb-1">Jenis Dokumen</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            >
              <option value="">-- Pilih Jenis --</option>
              {(periodeDokumen[periode] || []).map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* LINK */}
          <div>
            <label className="block font-medium mb-1">Link Dokumen</label>
            <input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="https://..."
            />
          </div>

          {/* SUBMIT */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className="w-full bg-[#346ac6] text-white font-bold py-2.5 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </motion.button>

          {/* NOTIFIKASI */}
          {success && (
            <p className="text-green-600 text-sm text-center">
              Upload berhasil!
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
}
