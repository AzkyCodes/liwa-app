import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";

export default function FormUploadAset({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    judul: "",
    jenis: "Artikel",
    penyusun: [""],
    link: "",
    status: "DRAFT",
    keterangan: "",
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && id) {
        const snap = await getDoc(doc(db, "asetIntelektual", id));
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            ...data,
            penyusun: data.penyusun || [""],
          });
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePenyusunChange = (index, value) => {
    const updated = [...form.penyusun];
    updated[index] = value;
    setForm({ ...form, penyusun: updated });
  };

  const addPenyusun = () => {
    setForm({ ...form, penyusun: [...form.penyusun, ""] });
  };

  const removePenyusun = (index) => {
    const updated = [...form.penyusun];
    updated.splice(index, 1);
    setForm({ ...form, penyusun: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul.trim() || form.penyusun.some((p) => !p.trim())) return;

    try {
      if (isEdit && id) {
        await updateDoc(doc(db, "asetIntelektual", id), form);
        alert("Aset berhasil diperbarui!");
      } else {
        await addDoc(collection(db, "asetIntelektual"), {
          ...form,
          tanggal: serverTimestamp(),
        });
        alert("Aset berhasil ditambahkan!");
      }
      navigate("/ai");
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  if (loading) return <p className="p-6 text-center">Memuat data...</p>;

  return (
  <Layout>
    <div className="flex flex-col bg-[#f6f1f1]">
      {/* FORM */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold text-[#3b4e8a] mb-4">
            {isEdit ? "Edit Aset Intelektual" : "Upload Aset Intelektual"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-medium">Judul Aset</label>
              <input
                name="judul"
                value={form.judul}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Jenis</label>
              <select
                name="jenis"
                value={form.jenis}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option>Artikel</option>
                <option>Knowledge Capture</option>
                <option>Video</option>
                <option>Kajian</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Penyusun</label>
              {form.penyusun.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    value={p}
                    onChange={(e) => handlePenyusunChange(i, e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  {form.penyusun.length > 1 && (
                    <button type="button" onClick={() => removePenyusun(i)} className="text-red-500">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPenyusun} className="text-blue-600 hover:underline">
                + Tambah Penyusun
              </button>
            </div>

            <div>
              <label className="block font-medium">Tautan</label>
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option>DRAFT</option>
                <option>FINAL</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Keterangan</label>
              <textarea
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows={3}
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#3b4e8a] text-white px-4 py-2 rounded hover:bg-[#2d3d7a]"
            >
              {isEdit ? "Simpan Perubahan" : "Simpan Aset"}
            </button>
          </form>
        </div>
      </main>
    </div>
  </Layout>
  );
}
