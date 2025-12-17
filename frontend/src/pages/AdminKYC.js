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
      <div className="relative pt-28 px-8 pb-20 max-w-7xl mx-auto text-white">

        {/* === HOLOGRAPHIC GRID BACKGROUND === */}
        <div className="absolute inset-0 -z-10 bg-black">
          <div className="absolute inset-0 opacity-20 bg-[url('https://i.imgur.com/4NJlQgg.png')] bg-[length:500px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-700/10 to-black" />
        </div>

        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-extrabold tracking-tight 
            bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 
            bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]">
            Verify Sellers
          </h1>
          <p className="text-gray-300/80 mt-2 text-lg">
            Review and manage KYC submissions. Approve only after validating all documents.
          </p>
        </motion.div>

        {/* === FILTER BUTTONS === */}
        <div className="flex items-center gap-3 mb-6">
          {[
            { label: "All", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-5 py-2 rounded-xl transition-all duration-300
                backdrop-blur-lg border 
                ${
                  status === f.value
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 border-cyan-400/40 shadow-[0_0_20px_rgba(0,200,255,0.5)]"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-cyan-400/40"
                }
              `}
            >
              {f.label}
            </button>
          ))}

          <div className="ml-auto text-sm text-cyan-300/80">
            {loading ? "Loading…" : `${items.length} result${items.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {/* === TABLE WRAPPER (HOLOPANEL) === */}
        <div className="
          overflow-x-auto rounded-2xl border border-cyan-400/20 
          bg-gradient-to-br from-black/40 via-black/30 to-cyan-900/10 
          shadow-[0_0_40px_rgba(0,200,255,0.25)]
          backdrop-blur-xl
        ">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-cyan-300 tracking-wide">
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
                <tr>
                  <td colSpan={8} className="p-12 text-center text-cyan-300/70">
                    Loading submissions…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-14 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl 
                      bg-white/5 border border-white/10 shadow-lg">
                      <span className="text-gray-300">No submissions for this filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <motion.tr
                    key={s._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-white/10 even:bg-white/[0.03] hover:bg-cyan-500/10 transition-all duration-200"
                  >
                    <td className="p-4">
                      <div className="leading-tight">
                        <p className="font-semibold text-cyan-200">{s.userId?.name}</p>
                        <p className="text-gray-400 text-xs">{s.userId?.email}</p>
                      </div>
                    </td>

                    <td className="p-4 capitalize">
                      <span
                        className={`
                          px-3 py-1 rounded-full text-xs border
                          ${
                            s.status === "approved"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : s.status === "rejected"
                              ? "bg-red-500/15 text-red-300 border-red-500/30"
                              : "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
                          }
                        `}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="p-4">{new Date(s.createdAt).toLocaleString()}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {["idProofUrl", "addressProofUrl", "bankProofUrl"].map((key) =>
                          s[key] ? (
                            <img
                              key={key}
                              src={s[key]}
                              className="w-12 h-12 object-cover rounded-lg cursor-pointer
                                border border-cyan-400/40 hover:ring-2 hover:ring-cyan-400/60"
                              onClick={() =>
                                setPreview({
                                  open: true,
                                  urls: [s[key]],
                                })
                              }
                            />
                          ) : null
                        )}

                        {(s.idProofUrl || s.addressProofUrl || s.bankProofUrl) && (
                          <button
                            className="px-3 py-1 text-xs rounded-lg 
                              bg-cyan-500/20 border border-cyan-400/40 
                              hover:bg-cyan-500/30 transition"
                            onClick={() =>
                              setPreview({
                                open: true,
                                urls: [s.idProofUrl, s.addressProofUrl, s.bankProofUrl].filter(Boolean),
                              })
                            }
                          >
                            View All
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-gray-300 max-w-xs truncate" title={s.note}>
                      {s.note || <span className="text-gray-500 italic">—</span>}
                    </td>

                    <td className="p-4">{s.reviewedBy ? `${s.reviewedBy.name}` : "—"}</td>
                    <td className="p-4">{s.reviewedAt ? new Date(s.reviewedAt).toLocaleString() : "—"}</td>

                    <td className="p-4">
                      {s.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approve(s._id)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 
                              hover:bg-emerald-700 transition shadow-[0_0_10px_rgba(0,255,100,0.4)]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(s._id)}
                            className="px-4 py-1.5 rounded-lg bg-red-600 
                              hover:bg-red-700 transition shadow-[0_0_10px_rgba(255,50,50,0.4)]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* === DOCUMENT PREVIEW MODAL === */}
        <Modal open={preview.open} onClose={() => setPreview({ open: false, urls: [] })}>
          <h3 className="text-xl font-bold mb-3">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preview.urls.map((u, i) => (
              <img
                key={i}
                src={u}
                className="w-full h-72 object-contain rounded-xl 
                  border border-cyan-400/40 bg-black/40 
                  shadow-[0_0_20px_rgba(0,200,255,0.3)]"
              />
            ))}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
