import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { toast } from "react-hot-toast";
import { useFormatCurrency } from "../utils/currency";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { format } = useFormatCurrency();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellerRanks, setSellerRanks] = useState([]);
  const [rankSortBy, setRankSortBy] = useState("sold");
  const [rankPage, setRankPage] = useState(1);
  const [rankPages, setRankPages] = useState(1);
  const [rankLimit, setRankLimit] = useState(10);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const s = await api.get("/admin/stats");
      const u = await api.get("/admin/users");
      const a = await api.get("/admin/auctions");
      const o = await api.get("/admin/orders");
      const i = await api.get("/admin/insights");
      const params = new URLSearchParams({ sortBy: rankSortBy, page: String(rankPage), limit: String(rankLimit) });
      const r = await api.get(`/admin/seller-rankings?${params.toString()}`);

      setStats(s.data);
      setUsers(u.data || []);
      setAuctions(a.data || []);
      setOrders(o.data || []);
      setInsights(i.data || null);
      setSellerRanks(r.data?.items || []);
      setRankPages(r.data?.pages || 1);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  }

  useEffect(() => {
    // refetch rankings when sort/page/limit changes
    (async () => {
      try {
        const params = new URLSearchParams({ sortBy: rankSortBy, page: String(rankPage), limit: String(rankLimit) });
        const r = await api.get(`/admin/seller-rankings?${params.toString()}`);
        setSellerRanks(r.data?.items || []);
        setRankPages(r.data?.pages || 1);
      } catch (e) {}
    })();
  }, [rankSortBy, rankPage, rankLimit]);

function OrdersTable({ orders, format }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-300 border-b border-white/10">
          <th className="py-2">Item</th>
          <th>Buyer</th>
          <th>Seller</th>
          <th>Amount</th>
          <th>Address</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.slice(0, 10).map((o) => (
          <tr key={o._id} className="border-b border-white/5">
            <td className="py-3">{o.auctionId?.title}</td>
            <td>{o.buyerId?.name}</td>
            <td>{o.sellerId?.name}</td>
            <td>{format ? format(o.amount) : o.amount}</td>
            <td className="max-w-xs truncate">
              {[
                o.shippingName,
                o.addressLine1,
                o.addressLine2,
                o.city,
                o.state,
                o.postalCode,
                o.country,
                o.phone,
              ].filter(Boolean).join(", ")}
            </td>
            <td>{new Date(o.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SellerRankingsTable({ rows }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-300 border-b border-white/10">
          <th className="py-2">Rank</th>
          <th>Seller</th>
          <th>Items Sold</th>
          <th>Revenue</th>
          <th>Auctions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.sellerId} className="border-b border-white/5">
            <td className="py-3 font-bold">#{r.rank}</td>
            <td>
              <div className="flex flex-col">
                <span>{r.name}</span>
                <span className="text-xs text-gray-400">{r.email}</span>
              </div>
            </td>
            <td>{r.soldCount}</td>
            <td>₹{r.revenue}</td>
            <td>{r.auctionsHosted}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

  if (!stats)
    return (
      <div className="text-center text-white pt-40 text-xl animate-pulse">
        Loading Admin Console...
      </div>
    );

  return (
    <AdminLayout>
      <div className="relative min-h-screen pt-28 px-6 pb-20 max-w-7xl mx-auto text-white overflow-hidden">

      {/* 🌌 BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-20" />

      {/* Aurora */}
      <div className="absolute inset-0 opacity-40 -z-10
          bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.25),transparent_65%),
              radial-gradient(circle_at_80%_80%,rgba(180,0,255,0.28),transparent_65%)]" 
      />

      {/* Arcane glyph */}
      <motion.img
        src="https://th.bing.com/th/id/OIP.4eYfrVQ_0KSTG1OaLJV0xAHaE8?w=258&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        className="absolute top-1/2 left-1/2 w-[900px] opacity-[0.08] -translate-x-1/2 -translate-y-1/2 -z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Neon particles */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[3px] h-[90px] bg-cyan-300/20 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "1800px" }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* 🌐 NAVIGATION PANEL */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 bg-white/5 backdrop-blur-xl border border-white/10 
                   rounded-2xl px-6 py-4 shadow-[0_0_35px_rgba(0,255,255,0.15)] 
                   flex flex-wrap gap-4"
      >
        <NavBtn text="Dashboard" link="/admin" color="cyan" />
        <NavBtn text="Manage Users" link="/admin/users" color="purple" />
        <NavBtn text="Manage Auctions" link="/admin/auctions" color="emerald" />

        <button
          onClick={() => navigate(-1)}
          className="nav-btn bg-gray-700 hover:bg-gray-600 px-2 py-2 rounded-lg font-semibold"
        >
          ← Back
        </button>
      </motion.div>

      {/* ✨ PAGE TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-10 
                   bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500
                   text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(0,200,255,0.5)]"
      >
        Admin Control Center
      </motion.h1>

      {/* ➤ STATS GRID */}
      <div className="grid lg:grid-cols-4 gap-8">
        <StatCard title="Total Users" value={stats.totalUsers} glow="cyan" />
        <StatCard title="Total Auctions" value={stats.totalAuctions} glow="purple" />
        <StatCard title="Active Auctions" value={stats.activeAuctions} glow="emerald" />
        <StatCard title="Revenue" value={format(stats.revenue)} glow="yellow" />
      </div>

      {/* 📊 CHARTS */}
      <div className="grid lg:grid-cols-3 gap-10 mt-16">
        <ChartCard title="Auction Status Overview">
          <Doughnut
            data={{
              labels: ["Active", "Ended"],
              datasets: [
                {
                  data: [stats.activeAuctions, stats.endedAuctions],
                  backgroundColor: ["#06b6d4", "#a855f7"],
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Daily Bidding Activity">
          <Bar
            data={{
              labels: stats.bidGraph.map((x) => x._id),
              datasets: [
                {
                  label: "Bids",
                  data: stats.bidGraph.map((x) => x.count),
                  backgroundColor: "#22c55e",
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Revenue Growth Trend">
          <Line
            data={{
              labels: stats.revenueGraph.map((r) => r.date),
              datasets: [
                {
                  label: "₹ Revenue",
                  data: stats.revenueGraph.map((r) => r.amount),
                  borderColor: "#facc15",
                  backgroundColor: "#facc1533",
                },
              ],
            }}
          />
        </ChartCard>
      </div>

      {/* 📈 INSIGHTS */}
      {insights && (
        <div className="mt-16 grid lg:grid-cols-3 gap-10">
          <ChartCard title="Top Categories (Listings)">
            <Doughnut
              data={{
                labels: insights.topByAuctions.map((x) => x.category || 'uncategorized'),
                datasets: [
                  {
                    data: insights.topByAuctions.map((x) => x.count),
                    backgroundColor: ["#06b6d4", "#a855f7", "#22c55e", "#f59e0b", "#ef4444", "#10b981"],
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard title="Revenue by Category">
            <Bar
              data={{
                labels: insights.revenueByCategory.map((x) => x.category || 'uncategorized'),
                datasets: [
                  {
                    label: "₹ Revenue",
                    data: insights.revenueByCategory.map((x) => x.revenue),
                    backgroundColor: "#60a5fa",
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard title="Conversion & Disputes">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Auctions" value={insights.conversion.totalAuctions} glow="cyan" />
              <StatCard title="With Orders" value={insights.conversion.auctionsWithOrders} glow="emerald" />
              <StatCard title="With Bids" value={insights.conversion.auctionsWithBids} glow="purple" />
              <StatCard title="A→O Rate" value={(insights.conversion.auctionToOrderRate * 100).toFixed(1) + '%'} glow="yellow" />
              <StatCard title="B→O Rate" value={(insights.conversion.bidToOrderRate * 100).toFixed(1) + '%'} glow="yellow" />
              <StatCard title="Dispute Rate" value={(insights.disputes.disputeRate * 100).toFixed(1) + '%'} glow="red" />
            </div>
          </ChartCard>
        </div>
      )}

      {/* 🗂 TABLE GRID */}
      <div className="grid lg:grid-cols-2 gap-12 mt-20">
        <TableCard title="Users Overview">
          <UserTable users={users} />
        </TableCard>

        <TableCard title="All Auctions">
          <AuctionTable auctions={auctions} format={format} />
        </TableCard>
      </div>

      {/* SELLER RANKINGS */}
      <div className="mt-12">
        <TableCard title="Top Sellers">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <label className="text-sm">Sort By:</label>
            <select
              value={rankSortBy}
              onChange={(e) => { setRankSortBy(e.target.value); setRankPage(1); }}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-md"
            >
              <option value="sold">Items Sold</option>
              <option value="revenue">Revenue</option>
              <option value="auctions">Auctions Hosted</option>
            </select>

            <label className="text-sm ml-4">Per Page:</label>
            <select
              value={rankLimit}
              onChange={(e) => { setRankLimit(Number(e.target.value)); setRankPage(1); }}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <SellerRankingsTable rows={sellerRanks} />

          <div className="flex items-center gap-4 mt-4">
            <button
              className="px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 disabled:opacity-50"
              disabled={rankPage <= 1}
              onClick={() => setRankPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="text-sm">Page {rankPage} of {rankPages}</span>
            <button
              className="px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 disabled:opacity-50"
              disabled={rankPage >= rankPages}
              onClick={() => setRankPage((p) => Math.min(rankPages, p + 1))}
            >
              Next
            </button>
          </div>
        </TableCard>
      </div>

      {/* ORDERS */}
      <div className="mt-12">
        <TableCard title="Orders">
          <OrdersTable orders={orders} format={format} />
        </TableCard>
      </div>

      {/* 🧿 RECENT ACTIVITY */}
      <div className="mt-20">
        <TableCard title="Recent Activity Logs">
          <ul className="space-y-3 text-gray-300">
            {stats.activity.slice(0, 6).map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 rounded-xl border border-white/10"
              >
                {a}
              </motion.li>
            ))}
          </ul>
        </TableCard>
      </div>

      </div>
    </AdminLayout>
  );
}




/* =====================================
      COMPONENTS (GODMODE STYLED)
   ===================================== */

function NavBtn({ text, link, color }) {
  const styles = {
    cyan: "bg-cyan-600/80 hover:bg-cyan-600",
    purple: "bg-purple-600/80 hover:bg-purple-600",
    emerald: "bg-emerald-600/80 hover:bg-emerald-600",
  };

  return (
    <Link
      to={link}
      className={`nav-btn ${styles[color]} font-semibold px-2 py-2 rounded-lg`}
    >
      {text}
    </Link>
  );
}

function StatCard({ title, value, glow }) {
  const glowColors = {
    cyan: "shadow-[0_0_25px_rgba(0,255,255,0.4)]",
    purple: "shadow-[0_0_25px_rgba(160,0,255,0.4)]",
    emerald: "shadow-[0_0_25px_rgba(0,255,150,0.4)]",
    yellow: "shadow-[0_0_25px_rgba(255,240,0,0.4)]",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl bg-white/5 border border-white/10 
                  backdrop-blur-xl ${glowColors[glow]} transition`}
    >
      <p className="text-gray-300 font-semibold">{title}</p>
      <p className="text-xl  mt-2 text-white">{value}</p>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white/5 
                    border border-white/10 backdrop-blur-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      {children}
    </div>
  );
}

function TableCard({ title, children }) {
  return (
    <div className="glass-card p-6 rounded-3xl bg-white/5 
                    border border-white/10 backdrop-blur-xl shadow-xl">
      <h2 className="text-xl font-bold mb-5 text-white">{title}</h2>
      {children}
    </div>
  );
}

function UserTable({ users }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-300 border-b border-white/10">
          <th className="py-2">Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.slice(0, 7).map((u) => (
          <tr key={u._id} className="border-b border-white/5">
            <td className="py-3">{u.name}</td>
            <td>{u.email}</td>
            <td className="capitalize text-cyan-300">{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AuctionTable({ auctions, format }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-300 border-b border-white/10">
          <th className="py-2">Title</th>
          <th>Status</th>
          <th>Current Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {auctions.slice(0, 7).map((a) => (
          <tr key={a._id} className="border-b border-white/5">
            <td className="py-3">{a.title}</td>
            <td className="capitalize text-emerald-300">{a.status}</td>
            <td>{format ? format(a.currentPrice) : a.currentPrice}</td>
            <td>
              <button
                className="px-3 py-1 bg-red-600 text-xs rounded hover:bg-red-700"
                onClick={() => deleteAuction(a._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function deleteAuction(id) {
  if (!window.confirm("Delete this auction?")) return;
  try {
    await api.delete(`/auctions/${id}`);
    window.location.reload();
  } catch {
    toast.error("Failed to delete auction");
  }
}
