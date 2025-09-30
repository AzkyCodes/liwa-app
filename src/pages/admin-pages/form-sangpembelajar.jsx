import { useState } from "react";
import { db } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage } from "../firebase/config"; // kita tambahkan ini

export default function AdminForm() {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [poin, setPoin] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fotoFile) return alert("Pilih file foto dulu");

    setLoading(true);
    try {
      const fotoRef = ref(storage, `sangPembelajar/${fotoFile.name}`);
      await uploadBytes(fotoRef, fotoFile);
      const fotoUrl = await getDownloadURL(fotoRef);

      await setDoc(doc(db, "sangPembelajar", "aktif"), {
        nama,
        jabatan,
        poin: parseInt(poin),
        fotoUrl,
      });

      alert("Berhasil disimpan!");
      setNama("");
      setJabatan("");
      setPoin("");
      setFotoFile(null);
    } catch (err) {
      console.error(err);
      alert("Gagal upload");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Form Sang Pembelajar</h2>

      <input
        type="text"
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Jabatan"
        value={jabatan}
        onChange={(e) => setJabatan(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Poin"
        value={poin}
        onChange={(e) => setPoin(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFotoFile(e.target.files[0])}
        className="w-full"
      />

      <button disabled={loading} className="bg-primary text-white px-4 py-2 rounded">
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
