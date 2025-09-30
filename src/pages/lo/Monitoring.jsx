import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

const periodeDokumen = {
  "Triwulan I": ["AI", "Jurnal"],
  "Triwulan II": ["AI", "Jurnal"],
  "Triwulan III": ["AI", "Jurnal"],
  "Triwulan IV": ["AI", "Jurnal"],
  "Semester I": ["CNC", "IDP", "BUKTI IDP"],
  "Semester II": ["CNC", "IDP", "BUKTI IDP"],
  "Tahunan": ["AI", "Learning from experiences", "Leader as a teacher"]
};

export default function Monitoring() {
  const [periode, setPeriode] = useState("Triwulan I");
  const [dataUpload, setDataUpload] = useState([]);
  const [masterPegawai, setMasterPegawai] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uploadSnap, pegawaiSnap] = await Promise.all([
          getDocs(collection(db, "lo_upload")),
          getDocs(query(collection(db, "pegawai"), orderBy("nama")))
        ]);

        const uploadData = uploadSnap.docs.map((doc) => doc.data());
        const pegawaiData = pegawaiSnap.docs.map((doc) => doc.data());

        setDataUpload(uploadData);
        setMasterPegawai(pegawaiData);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, []);

  const dokList = periodeDokumen[periode] || [];

  const getStatus = (nama, jenis) => {
    const found = dataUpload.find(
      (d) => d.nama === nama && d.periode === periode && d.jenis === jenis
    );
    return found ? (
      <a
        href={found.link}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 font-bold underline"
      >
        ✓
      </a>
    ) : (
      "–"
    );
  };

  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="text-3xl text-center font-bold text-[#346ac6] mt-7">
          MONITORING PEMENUHAN DOKUMEN LO PEGAWAI
        </h1>

        <main className="flex-grow max-w-8xl mx-auto">
          <div className="max-w-screen-xl mx-auto px-6 py-5">
            <div className="flex justify-end items-center">
              <select
                className="border px-3 py-1 rounded text-sm"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                {Object.keys(periodeDokumen).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <Link to="/upload">
                <button className="ml-2 bg-[#346ac6] text-white px-3 py-1 rounded text-sm font-semibold hover:underline">
                  Upload
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto rounded shadow bg-white">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-10 py-4">Nama</th>
                  <th className="px-10 py-4">Jabatan</th>
                  {dokList.map((jenis) => (
                    <th
                      key={jenis}
                      className="px-2 py-1 min-w-[200px] text-center"
                    >
                      {jenis}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {masterPegawai.map((pegawai) => (
                  <tr key={pegawai.nama} className="border-b">
                    <td className="px-10 py-4 whitespace-nowrap">{pegawai.nama}</td>
                    <td className="px-10 py-4 whitespace-nowrap">{pegawai.jabatan}</td>
                    {dokList.map((jenis) => (
                      <td
                        key={jenis}
                        className="px-2 py-1 text-center min-w-[180px]"
                      >
                        {getStatus(pegawai.nama, jenis)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
}
