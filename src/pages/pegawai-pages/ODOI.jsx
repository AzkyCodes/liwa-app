import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function OdoiDisplay() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus data ini?");
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "odoi", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus data:", err);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "odoi"));
      const result = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sorted = result.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setData(sorted);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col">
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-[#346ac6] mb-2 text-center">
            One Day One Information
          </h1>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/odoi/upload")}
              className="bg-[#346ac6] text-white px-3 py-1 rounded-md shadow hover:bg-[#2c58a6]"
            >
              Upload
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-[#346ac6] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nama Pegawai</th>
                  <th className="px-6 py-3 text-left">Jabatan</th>
                  <th className="px-6 py-3 text-left">Judul Materi</th>
                  <th className="px-6 py-3 text-left">Tanggal</th>
                  <th className="px-6 py-3 text-center">Link</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500"
                    >
                      Belum ada materi ditampilkan
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-[#f9fafb]">
                      <td className="px-6 py-3">{item.nama}</td>
                      <td className="px-6 py-3">{item.jabatan}</td>
                      <td className="px-6 py-3">{item.judul}</td>
                      <td className="px-6 py-3">{item.tanggal}</td>
                      <td className="px-6 py-3 text-center">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#346ac6] underline font-semibold"
                          >
                            Lihat
                          </a>
                        ) : (
                          <span className="text-gray-400">–</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-center space-x-2">
                        <button
                          onClick={() => navigate(`/odoi/edit/${item.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
}
