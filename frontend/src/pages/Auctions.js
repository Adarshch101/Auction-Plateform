import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function Auctions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");
  const [timeLeft, setTimeLeft] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const debounceRef = useRef(null);

  const categories = [
    "Artifacts",
    "Coins",
    "Vintage",
    "Books",
    "Watches",
    "Weapons",
    "Paintings",
  ];

  // Map UI sort to API sort
  const apiSort = useMemo(() => {
    if (sort === "high") return "price_desc";
    if (sort === "low") return "price_asc";
    if (sort === "ending") return "end_soon";
    return "created_desc";
  }, [sort]);

  // Fetch data (debounced on search)
  useEffect(() => {
    setLoading(true);
    setError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api
        .get("/auctions", {
          params: {
            q: search || undefined,
            category: category !== "all" ? category : undefined,
            priceMin: priceMin || undefined,
            priceMax: priceMax || undefined,
            timeLeft: timeLeft || undefined,
            sort: apiSort,
            page,
            limit,
          },
        })
        .then((res) => {
          const data = res.data;
          // Support both paged and array responses
          if (Array.isArray(data)) {
            setItems(data);
            setPages(1);
            setTotal(data.length);
          } else {
            setItems(data.items || []);
            setPages(data.pages || 1);
            setTotal(data.total || 0);
          }
        })
        .catch((e) => {
          setError(e?.response?.data?.message || "Failed to load auctions");
        })
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, category, apiSort, timeLeft, priceMin, priceMax, page]);

  function resetAndRefetch(updater) {
    setPage(1);
    updater();
  }

  return (
    <div className="relative min-h-screen bg-[#04010a] text-white px-6 pt-32 pb-20 overflow-hidden">

      {/* =============== CYBERPUNK CITY OVERLAY =============== */}
      <div className="absolute inset-0  bg-[url('https://th.bing.com/th/id/OIP.tgh660d6GOZAiPP6clX9-QHaEK?w=327&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1')]
                      bg-cover bg-center opacity-[0.18] pointer-events-none mix-blend-screen" />

      {/* =============== MYSTIC ARCANE FOG =============== */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(150,60,255,0.36),transparent_70%),
                                        radial-gradient(circle_at_80%_80%,rgba(255,60,200,0.28),transparent_70%)] opacity-40" />

      {/* =============== CYBER RAIN STREAKS =============== */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[75px] bg-purple-400/30 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "1800px" }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 0.8 + 0.5,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* =============== FLOATING ARCANE RUNES =============== */}
      <motion.img
        src="https://th.bing.com/th/id/OIP.vI0cUZocC3Q7l9c8HKoWjwHaJR?w=146&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        className="absolute top-1/2 left-1/2 w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12] pointer-events-none select-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* =============== SEARCH & FILTERS BAR =============== */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        {/* Search Bar */}
        <div className="flex items-center bg-white/5 border border-purple-500/20 rounded-xl px-4 py-3 w-full md:w-1/3 backdrop-blur-xl shadow-[0_0_15px_rgba(150,0,255,0.15)]">
          <FiSearch className="text-purple-300 text-xl" />
          <input
            placeholder="Search auctions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-purple-200 ml-3 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">

          {/* Category */}
          <select
            value={category}
            onChange={(e) => resetAndRefetch(() => setCategory(e.target.value))}
            className="bg-white/5 text-purple-600 border border-purple-500/20 px-4 py-3 rounded-xl backdrop-blur-xl shadow-[0_0_10px_rgba(150,0,255,0.2)] outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c.toLowerCase()}>
                {c}
              </option>
            ))}
          </select>

          {/* Time Left */}
          <select
            value={timeLeft}
            onChange={(e) => resetAndRefetch(() => setTimeLeft(e.target.value))}
            className="bg-white/5 text-purple-600 border border-purple-500/20 px-4 py-3 rounded-xl backdrop-blur-xl shadow-[0_0_10px_rgba(150,0,255,0.2)] outline-none"
          >
            <option value="">Any Time Left</option>
            <option value="1h">Ending in 1 hour</option>
            <option value="24h">Ending in 24 hours</option>
            <option value="7d">Ending in 7 days</option>
          </select>

          {/* Price Range */}
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min ₹"
            value={priceMin}
            onChange={(e) => resetAndRefetch(() => setPriceMin(e.target.value))}
            className="w-28 bg-white/5 text-purple-200 border border-purple-500/20 px-3 py-3 rounded-xl backdrop-blur-xl outline-none"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max ₹"
            value={priceMax}
            onChange={(e) => resetAndRefetch(() => setPriceMax(e.target.value))}
            className="w-28 bg-white/5 text-purple-200 border border-purple-500/20 px-3 py-3 rounded-xl backdrop-blur-xl outline-none"
          />

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => resetAndRefetch(() => setSort(e.target.value))}
            className="bg-white/5 text-purple-600 border border-purple-500/20 px-4 py-3 rounded-xl backdrop-blur-xl shadow-[0_0_10px_rgba(150,0,255,0.2)] outline-none"
          >
            <option value="none">Sort By</option>
            <option value="high">Highest Bid</option>
            <option value="low">Lowest Bid</option>
            <option value="ending">Ending Soon</option>
          </select>

          <FiFilter className="text-2xl text-purple-300 hidden md:block" />
        </div>
      </div>

      {/* ================== LOADING SKELETON ================== */}
      {loading && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((i) => (
            <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse 
              shadow-[0_0_20px_rgba(160,0,255,0.15)]" />
          ))}
        </div>
      )}

      {/* ================== ERROR ================== */}
      {!loading && error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {/* ================== NO RESULTS ================== */}
      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-400">No auctions found.</p>
      )}

      {/* ================== AUCTIONS GRID ================== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {items.map((a, i) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative bg-white/5 border border-purple-500/20 rounded-2xl 
                       shadow-[0_0_28px_rgba(160,0,255,0.25)] hover:shadow-[0_0_45px_rgba(200,0,255,0.4)]
                       hover:bg-white/10 transition p-4 flex flex-col group backdrop-blur-xl"
          >

            {/* ==== ARCANE HOVER RING ==== */}
            <motion.img
              src="none"
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-20 pointer-events-none transition"
            />

            {/* Image */}
            <div className="relative">
              <img
                src={a.image}
                className="rounded-xl h-48 w-full object-cover border border-purple-500/20"
                alt={a.title}
              />

              {/* Status Badge */}
              <span className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full 
                ${a.status === "active" ? "bg-pink-500/80" :
                  a.status === "ended" ? "bg-purple-700/80" :
                  "bg-blue-500/80"}`}
              >
                {a.status.toUpperCase()}
              </span>

            </div>

            {/* Info */}
            <div className="mt-4 flex-1">
              <h2 className="text-lg font-bold text-purple-200">{a.title}</h2>

              <p className="mt-1 text-gray-300 text-sm">
                Current Bid:{" "}
                <span className="text-pink-400 font-semibold">₹{a.currentPrice}</span>
              </p>

              <p className="mt-1 text-gray-500 text-xs">
                Ends: {new Date(a.endTime).toLocaleString()}
              </p>
            </div>

            {/* CTA */}
            <Link
              to={`/auction/${a._id}`}
              className="block mt-4 w-full text-center py-2 rounded-xl 
                         bg-gradient-to-r from-purple-600 to-pink-500 
                         hover:brightness-110 transition shadow-[0_0_25px_rgba(200,0,255,0.3)]"
            >
              View Details
            </Link>
          </motion.div>
        ))}

      </div>

      {/* ================== PAGINATION ================== */}
      {!loading && !error && pages > 1 && (
        <div className="max-w-7xl mx-auto mt-10 flex justify-center items-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-300">Page {page} of {pages} • {total} results</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
