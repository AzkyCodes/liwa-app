import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import Layout from "../../components/Layout";

const capaianMaster = [
  { judul: "Capaian 1", komponen: "Knowledge Management Implementation", sub: "Subkomponen Pengorganisasian dan Penyebarluasan", maks: 110 },
  { judul: "Capaian 2", komponen: "Learning Value Chain", sub: "Subkomponen Rencana Aksi Pembelajaran", maks: 100 },
  { judul: "Capaian 3", komponen: "Learning Value Chain", sub: "Subkomponen Individual Development Plan (IDP)", maks: 200 },
  { judul: "Capaian 4", komponen: "Learning Value Chain", sub: "Subkomponen Evaluasi Pembelajaran", maks: 100 },
  { judul: "Capaian 5", komponen: "Learning Value Chain", sub: "Subkomponen Hard Competency Pegawai", maks: 100 },
  { judul: "Capaian 6", komponen: "Learning Solutions", sub: "Subkomponen Structured Learning", maks: 100 },
  { judul: "Capaian 7", komponen: "Learning Solutions", sub: "Subkomponen Learning from Experiences", maks: 100 },
  { judul: "Capaian 8", komponen: "Learning Solutions", sub: "Subkomponen Pemenuhan Jam Pembelajaran (JP)", maks: 100 },
  { judul: "Capaian 9", komponen: "Learners Performance", sub: "Subkomponen Organizational Performance", maks: 100 },
  { judul: "Capaian 10", komponen: "Leaders Participation in Learning Process", sub: "Subkomponen Leaders as Teachers", maks: 100 },
  { judul: "Capaian 11", komponen: "Leaders Participation in Learning Process", sub: "Subkomponen Leaders as Role Model", maks: 100 },
];

export default function CapaianLO() {
  const [nilaiCapaian, setNilaiCapaian] = useState([]);
  const [periode, setPeriode] = useState("");

  useEffect(() => {
    const fetchLatestCapaian = async () => {
      const q = query(collection(db, "capaianLO"), orderBy("updatedAt", "desc"), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        setNilaiCapaian(doc.data().items || []);
        setPeriode(doc.id); // id = periode seperti "2025-07"
      }
    };
    fetchLatestCapaian();
  }, []);

  const totalMaks = capaianMaster.reduce((sum, item) => sum + item.maks, 0);
  const totalNilai = nilaiCapaian.reduce((a, b) => a + b, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-[#f6f1f1] p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
          <h1 className="text-center text-2xl font-bold text-[#3b4e8a] mb-1">
            CAPAIAN LO KPPN LIWA
          </h1>
          {periode && (
            <p className="text-center text-sm text-gray-600 mb-4">
              Periode: <span className="font-semibold">{periode}</span>
            </p>
          )}

          <div className="grid grid-cols-4 text-sm font-semibold text-[#3b4e8a] border-b pb-2 mb-4">
            <span></span>
            <span>LEARNING ORGANIZATION</span>
            <span className="text-center">NILAI MAKSIMAL</span>
            <span className="text-center">CAPAIAN</span>
          </div>

          {capaianMaster.map((item, index) => (
            <div key={index} className="grid grid-cols-4 items-start py-3 border-b text-sm">
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-[#fb9302] text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-[#3b4e8a]">{item.komponen}</p>
                <p className="text-xs text-gray-600">{item.sub}</p>
              </div>
              <div className="text-center text-[#3b4e8a]">{item.maks}</div>
              <div className="text-center text-[#3b4e8a]">
                {nilaiCapaian[index] ?? "-"}
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="grid grid-cols-4 font-bold text-[#3b4e8a] pt-4">
            <div></div>
            <div className="text-right pr-2">TOTAL</div>
            <div className="text-center">{totalMaks}</div>
            <div className="text-center">{totalNilai}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
