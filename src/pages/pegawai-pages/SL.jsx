import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";

export default function SelfLearning() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "selfLearning"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setList(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus item ini?");
    if (!konfirmasi) return;
    try {
      await deleteDoc(doc(db, "selfLearning", id));
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col">
        <main className="px-6 py-10 flex-grow">
          <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 px-2">
            <h1 className="text-3xl font-bold text-[#3b4e8a]">Self Learning</h1>
            <Link to="/sl/upload">
              <button className="bg-[#3b4e8a] text-white px-4 py-2 text-sm rounded-md hover:bg-[#2d3d7a]">
                + Tambah Self Learning
              </button>
            </Link>
          </div>

          {list.length === 0 ? (
            <p className="text-center text-gray-500">
              Belum ada data self learning.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col justify-between min-h-[200px]"
                >
                  <div>
                    <span className="text-sm text-gray-600 font-medium">
                      {item.nama}
                    </span>
                    <h3 className="text-lg font-bold">{item.judul}</h3>
                    <p className="text-sm text-gray-600">
                      Status: {item.status}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        Lihat Resume
                      </a>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-gray-100">
                    <Link
                      to={`/sl/upload?id=${item.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ✎ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
