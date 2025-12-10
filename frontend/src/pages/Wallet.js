import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import io from "socket.io-client";

export default function Wallet() {
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.token) {
      fetchWonAuctions();
      const s = io("http://localhost:4000");
      if (auth.userId) s.emit("registerUser", auth.userId);
      const refresh = () => fetchWonAuctions();
      s.on("auctionEnded", refresh);
      s.on("purchaseCompleted", refresh);
      return () => {
        s.off("auctionEnded", refresh);
        s.off("purchaseCompleted", refresh);
        s.close();
      };
    }
  }, [auth.token]);

  const fetchWonAuctions = async () => {
    try {
      const res = await api.get("/auctions/user/won");
      setWonAuctions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch won auctions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 px-6 max-w-4xl mx-auto text-white overflow-hidden">

      {/* ===== CYBERPUNK TOKYO BACKGROUND ===== */}
      <div className="absolute inset-0  bg-[url('https://th.bing.com/th/id/OIP.tgh660d6GOZAiPP6clX9-QHaEK?w=327&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1')]
                      bg-cover bg-center opacity-[0.18] mix-blend-screen pointer-events-none" />

      {/* ===== ARCANE FOG (Mystic Purple + Cyan) ===== */}
      <div className="absolute inset-0 
          bg-[radial-gradient(circle_at_20%_20%,rgba(160,70,255,0.45),transparent_65%),
              radial-gradient(circle_at_80%_80%,rgba(0,200,255,0.38),transparent_65%)]
          opacity-40 pointer-events-none" />

      {/* ===== CYBER RAIN ===== */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[80px] bg-cyan-300/20 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "1800px" }}
          transition={{ repeat: Infinity, duration: Math.random() * 1 + 0.6 }}
        />
      ))}

      {/* ===== ARCANE GLYPH SPINNING ===== */}
      <motion.img
        src="https://th.bing.com/th/id/OIP.vI0cUZocC3Q7l9c8HKoWjwHaJR?w=146&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        className="absolute top-1/3 left-1/2 w-[800px] -translate-x-1/2 opacity-[0.12] pointer-events-none select-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* ===== WALLET TITLE ===== */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-5xl font-extrabold 
                   bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 
                   text-transparent bg-clip-text drop-shadow-[0_0_18px_rgba(0,200,255,0.6)]"
      >
        My Wallet
      </motion.h1>

      {/* ===== WALLET CARD ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 mt-12 p-10 rounded-3xl 
                   bg-white/10 backdrop-blur-2xl border border-purple-500/30 
                   shadow-[0_0_45px_rgba(150,0,255,0.35)] space-y-10 overflow-hidden"
      >

        {/* ===== INNER ARCANE RING ===== */}
        <motion.img
          src="none"
          className="absolute -top-20 right-0 w-[450px] opacity-[0.05]"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />

        {/* ===== BALANCE DISPLAY ===== */}
        <div>
          <p className="text-2xl text-gray-300">Available Balance</p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-extrabold mt-2 
                       bg-gradient-to-r from-cyan-400 to-purple-400 
                       text-transparent bg-clip-text
                       drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]"
          >
            ₹12,500
          </motion.p>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex gap-6 flex-wrap">

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 rounded-xl text-xl font-semibold 
                       bg-gradient-to-r from-cyan-500 to-blue-600
                       shadow-[0_0_25px_rgba(0,200,255,0.4)]
                       hover:brightness-110 transition"
          >
            Add Funds
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 rounded-xl text-xl font-semibold 
                       bg-gradient-to-r from-purple-600 to-pink-500
                       shadow-[0_0_25px_rgba(200,0,255,0.35)]
                       hover:brightness-110 transition"
          >
            Withdraw
          </motion.button>

        </div>

        {/* ===== WON AUCTIONS ===== */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-purple-200 drop-shadow-[0_0_10px_rgba(150,0,255,0.4)]">
            Won Auctions
          </h3>

          {loading ? (
            <p className="text-gray-400 mt-3">Loading...</p>
          ) : wonAuctions.length === 0 ? (
            <p className="text-gray-400 mt-3 italic">You haven't won any auctions yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {wonAuctions.map((auction) => (
                <motion.div
                  key={auction._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 p-4 rounded-lg border border-cyan-500/30 hover:bg-white/10 transition"
                >
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-lg font-bold text-cyan-300">{auction.title}</h4>
                  <p className="text-gray-300 mt-1">₹{auction.currentPrice}</p>
                  <p className="text-xs mt-1 opacity-80">{auction.status === "bought" ? "Purchased" : "Won"}</p>
                  <p className="text-sm text-gray-400 mt-1">Seller: {auction.sellerId?.name}</p>
                  <Link
                    to={`/auctions/${auction._id}`}
                    className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-semibold hover:brightness-110 transition"
                  >
                    View Details
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
