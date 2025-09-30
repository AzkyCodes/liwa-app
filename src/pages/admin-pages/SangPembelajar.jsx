import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminSangPembelajarForm() {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [poin, setPoin] = useState("");
  const [status, setStatus] = useState("");

  // Ambil data lama
  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "sangPembelajar", "aktif"));
      if (snap.exists()) {
        const data = snap.data();
        setNama(data.nama || "");
        setJabatan(data.jabatan || "");
        setPoin(data.poin || "");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "sangPembelajar", "aktif"), {
        nama,
        jabatan,
        poin: parseInt(poin),
      });
      setStatus("Berhasil disimpan!");
    } catch (err) {
      console.error(err);
      setStatus("Gagal menyimpan.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-center text-primary">Edit Sang Pembelajar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)}
          placeholder="Jabatan"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          value={poin}
          onChange={(e) => setPoin(e.target.value)}
          placeholder="Poin"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
      {status && <p className="mt-4 text-center text-green-600">{status}</p>}
    </div>
  );
}
