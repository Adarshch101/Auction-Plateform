import { useEffect, useState } from "react";
import { api } from "../utils/api";
import SellerLayout from "../components/seller/SellerLayout";
import { motion } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export default function SellerStats() {
  const [stats, setStats] = useState({});
  const [graph, setGraph] = useState({ dates: [], revenue: [], items: [] });

  useEffect(() => {
    api.get("/seller/stats").then((res) => setStats(res.data));
    api.get("/seller/sales-graph").then((res) => setGraph(res.data));
  }, []);

  return (
    <SellerLayout>
      <div className="relative min-h-screen pt-10 px-8 pb-16 max-w-7xl mx-auto text-white overflow-hidden">

        {/* 🌌 AURORA + NEON LIGHTING */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-16 left-20 w-[420px] h-[420px] bg-cyan-500 blur-[160px]" />
          <div className="absolute top-40 right-10 w-[320px] h-[320px] bg-fuchsia-600 blur-[160px]" />
          <div className="absolute bottom-10 right-24 w-[480px] h-[480px] bg-purple-700 blur-[200px]" />
        </div>

        {/* ✨ PARTICLE FIELD */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[4px] h-[4px] bg-cyan-300 rounded-full opacity-50"
            initial={{
              x: Math.random() * 1400,
              y: Math.random() * 900,
              opacity: 0,
            }}
            animate={{
              y: ["0%", "-180%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-extrabold mb-12 
          bg-gradient-to-r from-cyan-400 to-purple-500 
          text-transparent bg-clip-text
          drop-shadow-[0_0_25px_rgba(0,255,255,0.35)]"
        >
          Seller Statistics
        </motion.h1>

        {/* ========== TOP STAT CARDS ========== */}
        <div className="grid md:grid-cols-3 gap-8">
          <StatCard label="Total Listings" value={stats.totalListings} color="cyan" delay={0.1} />
          <StatCard label="Items Sold" value={stats.soldItems} color="purple" delay={0.2} />
          <StatCard label="Revenue" value={`₹${stats.revenue}`} color="yellow" delay={0.3} />
        </div>

        {/* ========== MID STATS GRID ========== */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <StatCard label="Active Listings" value={stats.activeListings} color="emerald" delay={0.1} />
          <StatCard label="Auction Listings" value={stats.auctionListings} color="pink" delay={0.15} />
          <StatCard label="Direct Sale Listings" value={stats.directSaleListings} color="blue" delay={0.2} />
        </div>

        {/* ========== LOWER STATS GRID ========== */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <StatCard label="Out of Stock" value={stats.outOfStock} color="red" delay={0.1} />
          <StatCard label="Sales (Last 30 days)" value={stats.last30DaysSales} color="cyan" delay={0.15} />
          <StatCard label="Avg Order Value" value={`₹${stats.avgOrderValue}`} color="yellow" delay={0.2} />
        </div>

        {/* Single card row */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <StatCard label="Revenue (Last 30 days)" value={`₹${stats.revenueLast30Days}`} color="emerald" delay={0.1} />
        </div>

        {/* ========== CHARTS ========== */}
        <div className="grid md:grid-cols-2 gap-8 mt-14">

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
            <h3 className="font-semibold mb-3 text-cyan-300">Revenue • Last 30 Days</h3>
            <Line
              data={{
                labels: graph.dates,
                datasets: [{
                  label: "Revenue",
                  data: graph.revenue,
                  borderColor: "#22c55e",
                  backgroundColor: "#22c55e33",
                }],
              }}
            />
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
            <h3 className="font-semibold mb-3 text-purple-300">Items Sold • Last 30 Days</h3>
            <Bar
              data={{
                labels: graph.dates,
                datasets: [{
                  label: "Items Sold",
                  data: graph.items,
                  backgroundColor: "#60a5fa",
                }],
              }}
            />
          </div>

        </div>
      </div>
    </SellerLayout>
  );
}

/* ===========================================
   REUSABLE NEON STAT CARD
=========================================== */
function StatCard({ label, value, color, delay }) {
  const colorMap = {
    cyan: "text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.25)]",
    purple: "text-purple-300 shadow-[0_0_20px_rgba(180,0,255,0.25)]",
    yellow: "text-yellow-300 shadow-[0_0_20px_rgba(255,255,0,0.25)]",
    emerald: "text-emerald-300 shadow-[0_0_20px_rgba(0,255,150,0.25)]",
    pink: "text-pink-300 shadow-[0_0_20px_rgba(255,0,150,0.25)]",
    blue: "text-blue-300 shadow-[0_0_20px_rgba(0,150,255,0.25)]",
    red: "text-red-300 shadow-[0_0_20px_rgba(255,0,0,0.25)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10
        hover:bg-white/10 transition shadow-xl"
    >
      <p className="text-gray-300 text-sm">{label}</p>
      <p className={`text-4xl font-extrabold mt-2 ${colorMap[color]}`}>{value}</p>
    </motion.div>
  );
}
