import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-white p-10">Loading statistics...</p>;
  if (!stats) return <p className="text-white p-10">Failed to load statistics</p>;

  return (
    <AdminLayout>
      <div className="pt-28 px-8 pb-20 max-w-7xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
        >
          ← Back
        </button>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Detailed Statistics
        </h1>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard title="Total Auctions" value={stats.totalAuctions} color="purple" />
        <StatCard title="Active Auctions" value={stats.activeAuctions} color="emerald" />
        <StatCard title="Ended Auctions" value={stats.endedAuctions} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Bids per Day */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Bids per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bidGraph || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="_id" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #666" }} />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueGraph || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #666" }} />
              <Line type="monotone" dataKey="amount" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {(stats.activity || []).slice(0, 10).map((activity, idx) => (
            <li key={idx} className="p-3 bg-white/5 rounded-lg border border-white/5 text-gray-300">
              {activity}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-purple-700",
    emerald: "from-emerald-500 to-emerald-700",
    red: "from-red-500 to-red-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colors[color]} text-white shadow-xl`}
    >
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-4xl font-extrabold mt-2">{value}</p>
    </motion.div>
  );
}
