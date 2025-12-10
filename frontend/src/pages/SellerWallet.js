import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { useFormatCurrency } from "../utils/currency";

export default function SellerWallet() {
  const [wallet, setWallet] = useState({ revenue: 0, orders: [] });
  const [loading, setLoading] = useState(true);
  const { format } = useFormatCurrency();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/seller/wallet");
      setWallet(res.data || { revenue: 0, orders: [] });
    } catch (err) {
      console.error("Failed to fetch seller wallet", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 px-6 max-w-6xl mx-auto text-white overflow-hidden">

      {/* 🌌 AURORA BACKGROUND */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-cyan-500 blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600 blur-[160px]" />
      </div>

      {/* ✨ FLOATING PARTICLES */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[3px] h-[3px] bg-cyan-300 rounded-full opacity-40"
          initial={{ x: Math.random() * 2000, y: Math.random() * 1200, opacity: 0 }}
          animate={{
            y: ["0%", "-150%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* PAGE TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-10 bg-gradient-to-r 
                   from-cyan-400 to-purple-500 bg-clip-text text-transparent
                   drop-shadow-[0_0_18px_rgba(0,255,255,0.35)]"
      >
        Seller Wallet
      </motion.h1>

      {/* ========= WALLET STATS ========= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* TOTAL REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 
                     backdrop-blur-2xl shadow-[0_0_40px_rgba(0,255,255,0.15)]"
        >
          <p className="text-sm text-gray-300">Total Revenue (after platform fee)</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold mt-3 text-emerald-300 
                       drop-shadow-[0_0_12px_rgba(0,255,180,0.4)]"
          >
            {format(wallet.revenue)}
          </motion.p>
          {typeof wallet.feePercent !== 'undefined' && (
            <p className="text-xs text-gray-400 mt-2">Platform fee: {wallet.feePercent}%</p>
          )}
        </motion.div>

        {/* ORDER COUNT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 
                     backdrop-blur-2xl shadow-[0_0_40px_rgba(150,0,255,0.15)]"
        >
          <p className="text-sm text-gray-300">Total Orders</p>
          <p className="text-5xl font-extrabold mt-3 text-purple-300
                        drop-shadow-[0_0_12px_rgba(200,150,255,0.4)]"
          >
            {wallet.orders.length}
          </p>
        </motion.div>

      </div>

      {/* ========= ORDERS LIST ========= */}
      <div className="mt-14">
        <h3 className="text-3xl font-bold mb-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
          Recent Orders
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : wallet.orders.length === 0 ? (
          <p className="text-gray-400">No orders yet</p>
        ) : (
          <div className="space-y-5">
            {wallet.orders.map((o, index) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 
                           backdrop-blur-xl hover:bg-white/10 transition 
                           shadow-[0_0_25px_rgba(0,255,255,0.1)]"
              >
                <p className="font-semibold text-lg">{o.auctionId?.title}</p>
                <div className="mt-1 text-sm">
                  <span className="text-gray-300">Gross:</span>{' '}
                  <span className="text-cyan-300 font-semibold">{format(o.amount)}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-300">Net:</span>{' '}
                  <span className="text-emerald-300 font-semibold">{format(o.netAmount)}</span>
                </div>

                <p className="text-gray-300 text-sm mt-1">
                  Buyer: {o.buyerId?.name} ({o.buyerId?.email})
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
