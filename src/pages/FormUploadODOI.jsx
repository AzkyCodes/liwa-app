import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import Layout from "../components/Layout";

export default function FormUploadODOI() {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil ID dari URL (jika mode edit)

  const [pegawaiList, setPegawaiList] = useState([]);
  const [selectedNama, setSelectedNama] = useState("");
  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    judul: "",
    tanggal: "",
    link: "",
  });

  // Ambil daftar pegawai
  useEffect(() => {
    const fetchPegawai = async () => {
      const data = await getDocs(collection(db, "pegawai"));
      const result = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPegawaiList(result);
    };
    fetchPegawai();
  }, []);

  // Jika edit (ada ID), ambil data ODOI
  useEffect(() => {
    if (id) {
      const fetchODOI = async () => {
        const docRef = doc(db, "odoi", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm(data);
          setSelectedNama(data.nama);
        }
      };
      fetchODOI();
    }
  }, [id]);

  // Saat nama diubah, update jabatan otomatis
  const handleNamaChange = (e) => {
    const nama = e.target.value;
    const pegawai = pegawaiList.find((p) => p.nama === nama);
    setSelectedNama(nama);
    setForm({
      ...form,
      nama,
      jabatan: pegawai?.jabatan || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nama, jabatan, judul, tanggal, link } = form;
    if (!nama || !jabatan || !judul || !tanggal || !link)
      return alert("Lengkapi semua field!");

    try {
      if (id) {
        // mode edit
        const docRef = doc(db, "odoi", id);
        await updateDoc(docRef, {
          ...form,
          timestamp: serverTimestamp(),
        });
        alert("Data berhasil diperbarui!");
      } else {
        // mode tambah
        await addDoc(collection(db, "odoi"), {
          ...form,
          timestamp: serverTimestamp(),
        });
        alert("Data berhasil diupload!");
      }
      navigate("/odoi");
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col bg-[#f6f1f1]">
        <main className="flex-grow w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
          <h1 className="text-3xl font-bold text-[#3b4e8a] mb-5">
            {id ? "Edit Materi ODOI" : "Upload Materi ODOI"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-medium">Nama Pegawai</label>
              <select
                value={selectedNama}
                onChange={handleNamaChange}
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

            <div>
              <label className="block font-medium">Jabatan</label>
              <input
                type="text"
                name="jabatan"
                value={form.jabatan}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium">Judul Materi</label>
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Tanggal Pelaksanaan</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Link Dokumen</label>
              <input
                type="url"
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full mb-5 border rounded px-3 py-2"
                placeholder="https://..."
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.0 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-[#3b4e8a] text-white px-4 py-2 rounded hover:bg-[#2d3d7a] w-full"
            >
              {id ? "Perbarui Data" : "Simpan"}
            </motion.button>
          </form>
        </main>
      </div>
    </Layout>
  );
}
