import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import io from "socket.io-client";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/wishlist");
      const data = res.data;
      // Controller returns wishlist doc or {items: []}
      const list = Array.isArray(data) ? data : (data?.items || []);
      // Normalize to auctions
      const normalized = list.map((x) => x.auctionId || x);
      setItems(normalized);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
    // Listen for real-time notifications to refresh wishlist
    const s = io("http://localhost:4000");
    try {
      const userId = localStorage.getItem("userId");
      if (userId) s.emit("registerUser", userId);
    } catch {}
    const onNotif = (n) => {
      // When wishlist updated elsewhere, refresh if message hints so
      if (n && typeof n.message === 'string' && /wishlist/i.test(n.message)) {
        loadWishlist();
      }
    };
    s.on("notification", onNotif);
    return () => {
      s.off("notification", onNotif);
      s.close();
    };
  }, []);

  const removeItem = async (auctionId) => {
    try {
      await api.delete(`/wishlist/${auctionId}`);
      setItems((prev) => prev.filter((a) => (a._id || a) !== auctionId));
    } catch (e) {
      // silent fail, optionally toast
    }
  };

  return (
    <div className="relative min-h-screen pt-32 px-8 max-w-7xl mx-auto text-white overflow-hidden">

      {/* ===== BACKGROUND: CYBERPUNK TOKYO ===== */}
      <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.tgh660d6GOZAiPP6clX9-QHaEK?w=327&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1')]
                      bg-cover bg-center opacity-[0.18] mix-blend-screen pointer-events-none" />

      {/* ===== MYSTIC ARCANE FOG ===== */}
      <div className="absolute inset-0 
          bg-[radial-gradient(circle_at_20%_20%,rgba(160,70,255,0.5),transparent_65%),
              radial-gradient(circle_at_80%_80%,rgba(0,200,255,0.45),transparent_65%)]
          opacity-40 pointer-events-none" />

      {/* ===== CYBER RAIN ===== */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[80px] bg-cyan-300/20 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "1800px" }}
          transition={{ repeat: Infinity, duration: Math.random() * 1 + 0.6 }}
        />
      ))}

      {/* ===== ARCANE SPELL GLYPH (background) ===== */}
      <motion.img
        src="https://th.bing.com/th/id/OIP.vI0cUZocC3Q7l9c8HKoWjwHaJR?w=146&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        className="absolute top-1/2 left-1/2 w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.1]"
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      />

      {/* ===== PAGE TITLE ===== */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-5xl font-extrabold mb-12
                   bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400
                   text-transparent bg-clip-text drop-shadow-[0_0_18px_rgba(0,200,255,0.6)]"
      >
        My Wishlist
      </motion.h1>

      {/* States */}
      {!loading && error && (
        <p className="relative z-10 text-red-400">{error}</p>
      )}
      {loading && (
        <div className="relative z-10 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="relative z-10 text-gray-400">Your wishlist is empty.</p>
      )}

      {/* ===== WISHLIST GRID ===== */}
      {!loading && !error && items.length > 0 && (
        <div className="relative z-10 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {items.map((a, i) => (
            <motion.div
              key={(a && a._id) || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
              className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-xl 
                         border border-purple-500/20 shadow-[0_0_35px_rgba(160,0,255,0.25)]
                         hover:shadow-[0_0_55px_rgba(200,0,255,0.45)]
                         transition duration-300"
            >
              <img src={a?.image} alt={a?.title} className="w-full h-48 object-cover rounded-xl border border-purple-500/20" />
              <h3 className="text-xl font-semibold mt-4">{a?.title}</h3>
              <p className="text-cyan-300 mt-1">₹{a?.currentPrice ?? a?.startingPrice ?? 0}</p>
              <div className="flex gap-3 mt-4">
                <Link
                  to={`/auction/${a?._id}`}
                  className="flex-1 text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 transition"
                >
                  View Auction
                </Link>
                <button
                  onClick={() => removeItem(a?._id)}
                  className="px-4 py-3 rounded-xl bg-red-600/80 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
