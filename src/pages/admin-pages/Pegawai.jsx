import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Pegawai() {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [editId, setEditId] = useState(null);

  const pegawaiRef = collection(db, "pegawai");

  const fetchPegawai = async () => {
    const data = await getDocs(pegawaiRef);
    const result = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPegawaiList(result);
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !jabatan) return;

    if (editId) {
      const docRef = doc(db, "pegawai", editId);
      await updateDoc(docRef, { nama, jabatan });
    } else {
      await addDoc(pegawaiRef, { nama, jabatan });
    }

    setNama("");
    setJabatan("");
    setEditId(null);
    fetchPegawai();
  };

  const handleEdit = (pegawai) => {
    setNama(pegawai.nama);
    setJabatan(pegawai.jabatan);
    setEditId(pegawai.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus pegawai ini?")) {
      await deleteDoc(doc(db, "pegawai", id));
      fetchPegawai();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-[#3b4e8a] mb-8">Kelola Data Pegawai</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Pegawai"
            className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#3b4e8a]"
            required
          />
          <input
            type="text"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            placeholder="Jabatan"
            className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#3b4e8a]"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#3b4e8a] text-white px-6 py-2 rounded-md hover:bg-[#2c4da5] transition-all"
        >
          {editId ? "Update Pegawai" : "Tambah Pegawai"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-[#f6f1f1] text-[#3b4e8a]">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Jabatan</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pegawaiList.map((peg) => (
              <tr key={peg.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{peg.nama}</td>
                <td className="p-3">{peg.jabatan}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(peg)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(peg.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {pegawaiList.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  Belum ada data pegawai
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
