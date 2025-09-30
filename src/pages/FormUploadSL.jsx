import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";

export default function FormUploadSelfLearning() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get("id");

  const [pegawaiList, setPegawaiList] = useState([]);
  const [form, setForm] = useState({
    judul: "",
    nama: "",
    link: "",
    status: "Belum Diverifikasi",
  });

  const [loading, setLoading] = useState(false);

  // Ambil daftar pegawai
  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const data = await getDocs(collection(db, "pegawai"));
        const result = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPegawaiList(result);
      } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
      }
    };
    fetchPegawai();
  }, []);

  // Mode edit: ambil data berdasarkan editId
  useEffect(() => {
    const fetchData = async () => {
      if (editId) {
        try {
          const docRef = doc(db, "selfLearning", editId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setForm({ ...snap.data() });
          } else {
            alert("Data tidak ditemukan");
            navigate("/sl");
          }
        } catch (err) {
          console.error("Gagal mengambil data:", err);
        }
      }
    };
    fetchData();
  }, [editId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { judul, nama, link } = form;
    if (!judul || !nama || !link) return alert("Isi semua field wajib!");
    setLoading(true);
    try {
      if (editId) {
        // UPDATE
        await updateDoc(doc(db, "selfLearning", editId), {
          ...form,
          tanggal: serverTimestamp(),
        });
        alert("Data berhasil diperbarui");
      } else {
        // TAMBAH BARU
        await addDoc(collection(db, "selfLearning"), {
          ...form,
          tanggal: serverTimestamp(),
        });
        alert("Data berhasil ditambahkan");
      }
      navigate("/sl");
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Terjadi kesalahan saat menyimpan");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold text-[#3b4e8a] mb-4 text-center">
          {editId ? "Edit Self Learning" : "Upload Self Learning"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Judul */}
          <div>
            <label className="block font-medium">Judul Bacaan</label>
            <input
              name="judul"
              value={form.judul}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Nama Pegawai */}
          <div>
            <label className="block font-medium">Nama Pegawai</label>
            <select
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Pilih Pegawai --</option>
              {pegawaiList.map((p) => (
                <option key={p.id} value={p.nama}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Link Resume */}
          <div>
            <label className="block font-medium">Link Resume</label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://..."
              required
            />
          </div>

          {/* Status Verifikasi */}
          <div>
            <label className="block font-medium">Status Verifikasi</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Belum Diverifikasi">Belum Diverifikasi</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          {/* Tombol Submit */}
          <motion.button
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="bg-[#3b4e8a] text-white px-4 py-2 rounded hover:bg-[#2d3d7a] w-full"
          >
            {loading
              ? "Menyimpan..."
              : editId
              ? "Perbarui Data"
              : "Simpan"}
          </motion.button>
        </form>
      </div>
    </Layout>
  );
}
