import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminCapaianForm() {
  const [nilai, setNilai] = useState(Array(11).fill(""));
  const [status, setStatus] = useState("");

  // Load data awal jika ada
  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "capaianLO", "list"));
      if (snap.exists()) {
        const items = snap.data().items;
        if (items && items.length === 11) {
          setNilai(items);
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (index, value) => {
    const updated = [...nilai];
    updated[index] = value;
    setNilai(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const numbers = nilai.map((n) => parseInt(n, 10) || 0);
      await setDoc(doc(db, "capaianLO", "list"), {
        items: numbers,
      });
      setStatus("Berhasil disimpan!");
    } catch (err) {
      console.error(err);
      setStatus("Gagal menyimpan data.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold text-center text-primary mb-4">
        Form Input Capaian LO
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {nilai.map((val, i) => (
          <div key={i} className="flex items-center gap-4">
            <label className="w-32 font-medium">Capaian {i + 1}</label>
            <input
              type="number"
              min={0}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              className="border px-3 py-1 rounded w-full"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
      {status && <p className="mt-4 text-center text-sm text-green-600">{status}</p>}
    </div>
  );
}
