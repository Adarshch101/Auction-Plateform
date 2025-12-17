import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminWalletApprovals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await api.get("/wallet/admin/requests", { params: { status } });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast.error("Failed to load wallet requests");
    } finally {
      setLoading(false);
    }
  }

  async function act(id, approve) {
    try {
      if (approve) {
        await api.put(`/wallet/admin/requests/${id}/approve`, {});
        toast.success("Request approved");
      } else {
        const note = (notes[id] || '').trim();
        if (!note) {
          toast.error("Rejection note is required");
          return;
        }
        await api.put(`/wallet/admin/requests/${id}/reject`, { note });
        toast.success("Request rejected");
      }
      fetchItems();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  }

  return (
    <div className="min-h-screen text-white pt-24 px-6 max-w-6xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold mb-6">
        Wallet Approvals
      </motion.h1>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-gray-300">Status:</label>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">No requests</p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r._id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${r.type === 'deposit' ? 'bg-emerald-600/20 border-emerald-400/30 text-emerald-200' : 'bg-pink-600/20 border-pink-400/30 text-pink-200'}`}>
                      {r.type}
                    </span>
                    <span className="text-sm text-gray-300">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-200">
                    User: {r.userId?.name || r.userId?.email || r.userId}
                  </div>
                  <div className="font-semibold">Amount: ₹{Number(r.amount || 0).toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-400">Status: {r.status}</div>
                  {r.status !== 'pending' && r.note ? (
                    <div className="text-xs text-yellow-200">Note: {r.note}</div>
                  ) : null}
                </div>
                {r.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => act(r._id, true)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:brightness-110">Approve</button>
                    <button onClick={() => act(r._id, false)} className="px-4 py-2 rounded-lg bg-red-600 hover:brightness-110">Reject</button>
                  </div>
                ) : null}
              </div>
              {r.status === 'pending' ? (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Rejection note (required for Reject)</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm outline-none focus:border-white/30"
                    rows={2}
                    value={notes[r._id] || ''}
                    onChange={(e)=>setNotes(prev=>({ ...prev, [r._id]: e.target.value }))}
                    placeholder="Add reason for rejection"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
