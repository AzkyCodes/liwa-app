import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export default function AdminLeaderboardForm() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    ai: 0,
    jamlat: 0,
    klc: 0,
    sl: 0,
    odoi: 0,
    prestasi: 0,
    hc: 0,
    literasi: 0,
  });
  const [status, setStatus] = useState("");

  // Ambil daftar pegawai
  useEffect(() => {
    const fetchPegawai = async () => {
      const snapshot = await getDocs(collection(db, "pegawai"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPegawaiList(list);
    };
    fetchPegawai();
  }, []);

  // Ambil data leaderboard jika pegawai dipilih
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedId) return;

      const ref = doc(db, "leaderboard", selectedId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const scoresOnly = {
          ai: data.ai || 0,
          jamlat: data.jamlat || 0,
          klc: data.klc || 0,
          sl: data.sl || 0,
          odoi: data.odoi || 0,
          prestasi: data.prestasi || 0,
          hc: data.hc || 0,
          literasi: data.literasi || 0,
        };
        setFormData(scoresOnly);
      } else {
        setFormData({
          ai: 0,
          jamlat: 0,
          klc: 0,
          sl: 0,
          odoi: 0,
          prestasi: 0,
          hc: 0,
          literasi: 0,
        });
      }
    };
    fetchLeaderboard();
  }, [selectedId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return setStatus("Pilih pegawai terlebih dahulu");

    const pegawai = pegawaiList.find((p) => p.id === selectedId);
    if (!pegawai) return setStatus("Data pegawai tidak ditemukan.");

    await setDoc(doc(db, "leaderboard", selectedId), {
      nama: pegawai.nama,
      jabatan: pegawai.jabatan,
      ...formData,
    });

    setStatus("✅ Data berhasil disimpan!");
    setTimeout(() => setStatus(""), 3000);
  };

  const handleDelete = async () => {
    if (!selectedId) return setStatus("Pilih pegawai terlebih dahulu");
    const confirmDelete = confirm("Yakin ingin menghapus data leaderboard pegawai ini?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "leaderboard", selectedId));
    setFormData({
      ai: 0,
      jamlat: 0,
      klc: 0,
      sl: 0,
      odoi: 0,
      prestasi: 0,
      hc: 0,
      literasi: 0,
    });
    setStatus("🗑️ Data berhasil dihapus!");
    setTimeout(() => setStatus(""), 3000);
  };

  const selectedPegawai = pegawaiList.find(p => p.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center text-[#3b4e8a] mb-10 tracking-wide">
        🏆 Input Nilai Leaderboard Pegawai
      </h2>

      {/* Dropdown Pegawai */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pilih Pegawai
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b4e8a] text-sm"
        >
          <option value="">-- Pilih Pegawai --</option>
          {pegawaiList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama} - {p.jabatan}
            </option>
          ))}
        </select>
      </div>

      {/* Preview nama dan jabatan */}
      {selectedPegawai && (
        <div className="mb-6 text-sm bg-[#f9fafb] p-4 rounded-lg border border-gray-200">
          <p><span className="font-semibold text-[#3b4e8a]">Nama:</span> {selectedPegawai.nama}</p>
          <p><span className="font-semibold text-[#3b4e8a]">Jabatan:</span> {selectedPegawai.jabatan}</p>
        </div>
      )}

      {/* Form Nilai */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label className="capitalize block text-sm font-medium text-gray-700 mb-1">
              {key}
            </label>
            <input
              type="number"
              name={key}
              min={0}
              value={value}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-[#3b4e8a] hover:bg-[#2c4da5] text-white font-semibold py-2 rounded-lg transition-all"
          >
            💾 Simpan Nilai
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            🗑️ Hapus Data
          </button>
        </div>
      </form>

      {/* Status Message */}
      {status && (
        <div className="text-center mt-6 text-sm font-semibold text-green-600 animate-fadeIn">
          {status}
        </div>
      )}
    </div>
  );
}
