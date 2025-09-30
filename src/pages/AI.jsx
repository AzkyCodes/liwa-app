import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

export default function AsetIntelektual() {
  const [asets, setAsets] = useState([]);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    const fetchAsets = async () => {
      const snapshot = await getDocs(collection(db, "asetIntelektual"));
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const commentsDoc = await getDoc(doc(db, "komentarAset", docSnap.id));
          return {
            id: docSnap.id,
            ...data,
            komentar: commentsDoc.exists() ? commentsDoc.data().list || [] : [],
          };
        })
      );
      setAsets(data);
    };
    fetchAsets();
  }, []);

  const handleCommentChange = (asetId, text) => {
    setNewComments({ ...newComments, [asetId]: text });
  };

  const handleSubmitComment = async (asetId) => {
    const newComment = newComments[asetId]?.trim();
    if (!newComment) return;

    const asetDoc = doc(db, "komentarAset", asetId);
    try {
      await setDoc(
        asetDoc,
        {
          list: arrayUnion(newComment),
        },
        { merge: true }
      );

      setAsets((prev) =>
        prev.map((aset) =>
          aset.id === asetId
            ? { ...aset, komentar: [...aset.komentar, newComment] }
            : aset
        )
      );
      setNewComments({ ...newComments, [asetId]: "" });
    } catch (error) {
      console.error("Gagal menyimpan komentar:", error);
      alert("Terjadi kesalahan saat menyimpan komentar.");
    }
  };

  const handleDeleteComment = async (asetId, komentar) => {
    const konfirmasi = confirm("Yakin ingin menghapus komentar ini?");
    if (!konfirmasi) return;

    try {
      const komentarRef = doc(db, "komentarAset", asetId);
      await updateDoc(komentarRef, {
        list: arrayRemove(komentar)
      });

      setAsets((prev) =>
        prev.map((aset) =>
          aset.id === asetId
            ? {
                ...aset,
                komentar: aset.komentar.filter((k) => k !== komentar)
              }
            : aset
        )
      );
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
      alert("Terjadi kesalahan saat menghapus komentar.");
    }
  };

  const handleDelete = async (asetId) => {
    const konfirmasi = confirm("Yakin ingin menghapus aset ini?");
    if (!konfirmasi) return;
    try {
      await deleteDoc(doc(db, "asetIntelektual", asetId));
      setAsets((prev) => prev.filter((a) => a.id !== asetId));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Terjadi kesalahan saat menghapus aset.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col">
        <main className="flex-grow px-6 py-10">
          <div className="flex justify-between items-center max-w-7xl mx-auto mb-10 px-2">
            <h1 className="text-3xl font-bold text-[#3b4e8a]">Aset Intelektual</h1>
            <Link to="/ai/upload">
              <button className="bg-[#3b4e8a] text-white px-4 py-2 text-sm rounded-md hover:bg-[#2d3d7a]">
                + Tambah Aset
              </button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {asets.length === 0 && (
              <p className="text-center text-gray-500 col-span-full">
                Belum ada aset yang ditambahkan.
              </p>
            )}
            {asets.map((aset) => (
              <div key={aset.id} className="rounded-xl bg-white shadow p-4 space-y-2">
                <span className="text-sm bg-[#3b4e8a] text-white px-2 py-1 rounded-full">
                  {aset.jenis}
                </span>
                <h3 className="text-xl font-semibold">{aset.judul}</h3>
                <p className="text-sm text-gray-600">Penyusun: {aset.penyusun?.join(", ")}</p>
                <p className="text-sm text-gray-600">Status: {aset.status}</p>
                <p className="text-sm">Keterangan: {aset.keterangan}</p>
                {aset.link && (
                  <a
                    href={aset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Lihat Aset
                  </a>
                )}
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-1">Komentar:</h4>
                  {(aset.komentar || []).map((cmt, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                      <p className="text-sm">{cmt}</p>
                      <button
                        onClick={() => handleDeleteComment(aset.id, cmt)}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 mt-2">
                    <textarea
                      rows={2}
                      placeholder="Tulis komentar..."
                      value={newComments[aset.id] || ""}
                      onChange={(e) => handleCommentChange(aset.id, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring focus:border-blue-400"
                    />
                    <button
                      onClick={() => handleSubmitComment(aset.id)}
                      className="bg-[#3b4e8a] text-white px-4 py-1 rounded-md text-sm self-end"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Link
                    to={`/ai/edit/${aset.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✎ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(aset.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}
