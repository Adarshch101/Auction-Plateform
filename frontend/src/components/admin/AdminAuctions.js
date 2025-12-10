import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { motion } from "framer-motion";

export default function AdminAuctions() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuctions();
  }, []);

  async function loadAuctions() {
    try {
      setLoading(true);
      const res = await api.get("/admin/auctions");
      setAuctions(res.data);
    } catch (err) {
      console.error("Failed to load auctions:", err);
      toast.error("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/auctions/${id}`, { status });
      toast.success(`Auction marked as ${status}`);
      loadAuctions();
    } catch (err) {
      console.error("Failed to update auction status:", err);
      toast.error("Failed to update status");
    }
  }

  async function deleteAuction(id) {
    const ok = window.confirm("DELETE permanently?");
    if (!ok) return;

    try {
      await api.delete(`/auctions/${id}`);
      toast.success("Auction deleted");
      loadAuctions();
    } catch (err) {
      console.error("Failed to delete auction:", err);
      toast.error("Failed to delete auction");
    }
  }

  return (
    <AdminLayout>
      <div className="relative min-h-screen pt-20 p-10 text-white overflow-hidden">

      {/* 🌌 Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-20" />

      {/* Neon Aurora */}
      <div className="absolute inset-0 opacity-40 -z-10 
        bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.25),transparent_65%),
            radial-gradient(circle_at_80%_80%,rgba(160,0,255,0.28),transparent_65%)]" />

      {/* Arcane Glyph */}
      <motion.img
        src="https://i.imgur.com/jUCuNHe.png"
        className="absolute right-20 top-1/3 w-[700px] opacity-[0.06] -z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Neon Particles */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[3px] h-[80px] bg-cyan-300/20 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "2000px" }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        
        {/* Floating Glass Title Box */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl 
                     shadow-[0_0_30px_rgba(0,255,255,0.15)] flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 
                         text-transparent bg-clip-text drop-shadow-[0_0_18px_rgba(0,200,255,0.5)]"
          >
            Auction Moderation
          </h1>
        </motion.div>

        <Link
          to="/admin/auctions/add"
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 
                     rounded-xl font-semibold shadow-[0_0_25px_rgba(0,200,255,0.4)] transition"
        >
          + Create Auction
        </Link>
      </div>

      {/* ===== DATA TABLE ===== */}
      {loading ? (
        <p className="text-gray-400">Loading auctions...</p>
      ) : auctions.length === 0 ? (
        <p className="text-gray-400">No auctions found</p>
      ) : (
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl
                        shadow-[0_0_35px_rgba(0,255,255,0.2)] relative z-10">

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-300 border-b border-white/10">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Current Price</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {auctions.map((a) => (
                <motion.tr
                  key={a._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="p-3 font-semibold">{a.title}</td>

                  <td className="p-3 capitalize">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold shadow-md
                        ${a.status === "active"
                          ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/20"
                          : a.status === "upcoming"
                          ? "bg-yellow-600/30 text-yellow-300 border border-yellow-500/20"
                          : "bg-red-600/30 text-red-300 border border-red-500/20"
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="p-3 text-cyan-300 font-semibold">₹{a.currentPrice}</td>

                  <td className="p-3 flex gap-2 justify-center">

                    {/* Activate */}
                    <ActionBtn
                      label="Active"
                      color="emerald"
                      onClick={() => updateStatus(a._id, "active")}
                    />

                    {/* End */}
                    <ActionBtn
                      label="End"
                      color="yellow"
                      onClick={() => updateStatus(a._id, "ended")}
                    />

                    {/* Delete */}
                    <ActionBtn
                      label="Delete"
                      color="red"
                      onClick={() => deleteAuction(a._id)}
                    />

                    {/* Edit */}
                    <Link
                      to={`/admin/auctions/${a._id}/edit`}
                      className="px-4 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-125 transition shadow-md"
                    >
                      Edit
                    </Link>

                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
      </div>
    </AdminLayout>
  );
}


/* ============================================
    COMPONENTS — BUTTONS WITH GODMODE STYLE
   ============================================ */

function ActionBtn({ label, color, onClick }) {
  const colors = {
    emerald: "from-emerald-600 to-emerald-400 shadow-emerald-500/30",
    yellow: "from-yellow-600 to-yellow-400 shadow-yellow-500/30",
    red: "from-red-600 to-red-400 shadow-red-500/30",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 text-xs font-semibold rounded-lg 
      bg-gradient-to-r ${colors[color]} 
      hover:brightness-125 transition shadow-md`}
    >
      {label}
    </button>
  );
}
