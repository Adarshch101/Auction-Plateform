import { useEffect, useState } from "react";
import { api } from "../utils/api";
import SellerLayout from "../components/seller/SellerLayout";
import { motion } from "framer-motion";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/seller/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <SellerLayout>
      <div className="relative min-h-screen pt-28 px-8 text-white overflow-hidden">

        {/* 🌌 AURORA BACKLIGHT */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-cyan-500 blur-[150px]" />
          <div className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-purple-700 blur-[160px]" />
        </div>

        {/* ✨ FLOATING PARTICLES */}
        {[...Array(28)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[4px] h-[4px] bg-cyan-300 rounded-full opacity-50"
            initial={{ x: Math.random() * 1500, y: Math.random() * 1000, opacity: 0 }}
            animate={{
              y: ["0%", "-160%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-10 
                     bg-gradient-to-r from-cyan-400 to-purple-500 
                     text-transparent bg-clip-text 
                     drop-shadow-[0_0_18px_rgba(0,255,255,0.35)]"
        >
          Seller Orders
        </motion.h1>

        {/* ORDERS LIST */}
        {orders.length === 0 ? (
          <p className="text-gray-400 text-lg">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((o, index) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 
                           backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.15)]
                           hover:bg-white/10 transition"
              >
                {/* TITLE */}
                <p className="font-semibold text-xl text-white">
                  {o.auctionId?.title}
                </p>

                {/* PRICE */}
                <p className="text-emerald-300 font-semibold mt-1 text-lg">
                  ₹{o.amount}
                </p>

                {/* BUYER INFO */}
                <p className="text-gray-300 mt-1">
                  Buyer: {o.buyerId?.name} ({o.buyerId?.email})
                </p>

                {/* SHIPPING ADDRESS */}
                <p className="text-gray-400 text-sm mt-1">
                  {[
                    o.shippingName,
                    o.addressLine1,
                    o.addressLine2,
                    o.city,
                    o.state,
                    o.postalCode,
                    o.country,
                  ].filter(Boolean).join(", ")}
                </p>
                <p className="text-gray-400 text-sm">Phone: {o.phone}</p>

                {/* DATE */}
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
