import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import AdminLayout from "../components/admin/AdminLayout";
import toast from "react-hot-toast";
import Modal from "../components/ui/Modal";

export default function AdminKYC() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({ open: false, urls: [] });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/kyc-submissions", { params: { status } });
      setItems(res.data || []);
    } catch (e) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const approve = async (id) => {
    try {
      await api.put(`/admin/kyc/${id}/approve`);
      toast.success("KYC approved");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to approve");
    }
  };
  const reject = async (id) => {
    const note = prompt("Enter rejection note (optional)") || "";
    try {
      await api.put(`/admin/kyc/${id}/reject`, { note });
      toast.success("KYC rejected");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <AdminLayout>
      <div className="pt-28 px-8 pb-20 max-w-7xl mx-auto text-white">
        <div className="mb-8">
          <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="text-4xl font-extrabold mb-2 tracking-tight">
            Verify Sellers
          </motion.h1>
          <p className="text-gray-300/90">Review and manage KYC submissions. Approve only after verifying all documents.</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {[
            {label: "All", value: ""},
            {label: "Pending", value: "pending"},
            {label: "Approved", value: "approved"},
            {label: "Rejected", value: "rejected"},
          ].map((f)=> (
            <button
              key={f.value+f.label}
              onClick={()=>setStatus(f.value)}
              className={`px-4 py-2 rounded-xl border transition ${status===f.value ? "bg-purple-600/80 border-purple-400 text-white shadow-lg" : "bg-white/5 border-white/15 hover:bg-white/10 text-gray-200"}`}
            >
              {f.label}
            </button>
          ))}
          <div className="ml-auto text-sm text-gray-300/80">
            {loading ? "Loading..." : `${items.length} result${items.length===1?"":"s"}`}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <table className="w-full text-sm">
            <thead className="bg-white/5/">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Submitted</th>
                <th className="p-4 text-left">Docs</th>
                <th className="p-4 text-left">Note</th>
                <th className="p-4 text-left">Reviewed By</th>
                <th className="p-4 text-left">Reviewed At</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-10 text-center text-gray-400">Loading submissions…</td></tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-14 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-gray-300">No submissions found for this filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((s)=> (
                  <tr key={s._id} className="border-b border-white/10 even:bg-white/[0.03] hover:bg-white/[0.06] transition">
                    <td className="p-4">
                      <div className="leading-tight">
                        <p className="font-semibold">{s.userId?.name}</p>
                        <p className="text-gray-400 text-xs">{s.userId?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${s.status==='approved' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : s.status==='rejected' ? 'bg-red-500/15 text-red-300 border-red-500/30' : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {s.idProofUrl && (
                          <img src={s.idProofUrl} alt="ID" className="w-11 h-11 object-cover rounded-lg cursor-zoom-in border border-white/10 hover:ring-2 hover:ring-cyan-400/60" onClick={()=>setPreview({open:true, urls:[s.idProofUrl]})} />
                        )}
                        {s.addressProofUrl && (
                          <img src={s.addressProofUrl} alt="Address" className="w-11 h-11 object-cover rounded-lg cursor-zoom-in border border-white/10 hover:ring-2 hover:ring-cyan-400/60" onClick={()=>setPreview({open:true, urls:[s.addressProofUrl]})} />
                        )}
                        {s.bankProofUrl && (
                          <img src={s.bankProofUrl} alt="Bank" className="w-11 h-11 object-cover rounded-lg cursor-zoom-in border border-white/10 hover:ring-2 hover:ring-cyan-400/60" onClick={()=>setPreview({open:true, urls:[s.bankProofUrl]})} />
                        )}
                        {(s.idProofUrl || s.addressProofUrl || s.bankProofUrl) && (
                          <button className="px-2.5 py-1 text-xs rounded-lg bg-white/10 border border-white/20 hover:bg-white/20" onClick={()=>setPreview({open:true, urls:[s.idProofUrl, s.addressProofUrl, s.bankProofUrl].filter(Boolean)})}>Quick View</button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 max-w-xs truncate" title={s.note}>{s.note || <span className="text-gray-500 italic">—</span>}</td>
                    <td className="p-4">{s.reviewedBy ? `${s.reviewedBy.name} (${s.reviewedBy.email})` : "—"}</td>
                    <td className="p-4">{s.reviewedAt ? new Date(s.reviewedAt).toLocaleString() : "—"}</td>
                    <td className="p-4">
                      {s.status === 'pending' ? (
                        <div className="flex flex-wrap gap-2">
                          <button onClick={()=>approve(s._id)} className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-sm">Approve</button>
                          <button onClick={()=>reject(s._id)} className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 shadow-sm">Reject</button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal open={preview.open} onClose={()=>setPreview({open:false, urls:[]})}>
          <h3 className="text-xl font-bold mb-3">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preview.urls.map((u, i)=> (
              <img key={i} src={u} alt={`doc-${i}`} className="w-full h-72 object-contain rounded-xl border border-white/10 bg-black/30" />
            ))}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
