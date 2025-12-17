import { useEffect, useState } from "react";
import { api } from "../utils/api";
import NotificationList from "../components/NotificationList";
import { motion } from "framer-motion";
import Skeleton from "../components/ui/Skeleton";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get("/notifications")
      .then((res) => setList(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const markAll = async () => {
    try {
      await api.put("/notifications/read-all");
      setList((prev) => prev.map((n) => ({ ...n, seen: true })));
    } catch {}
  };

  const clearAll = async () => {
    try {
      await api.delete("/notifications/clear");
      setList([]);
    } catch {}
  };

  const markOne = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      setList((prev) => prev.map((n) => (n._id === id ? { ...n, seen: true } : n)));
    } catch {}
  };

  // pagination derivation
  const start = (page - 1) * limit;
  const end = start + limit;
  const paged = list.slice(start, end);
  useEffect(() => {
    const totalPages = Math.max(Math.ceil((list?.length || 0) / Math.max(limit, 1)), 1);
    setPages(totalPages);
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, limit]);

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 px-6">

      {/* Aurora background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-[380px] h-[380px] bg-cyan-500 blur-[160px]" />
        <div className="absolute bottom-24 right-14 w-[420px] h-[420px] bg-purple-700 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_16px_rgba(0,255,255,0.4)]">
            Notifications
          </h1>

          <div className="flex gap-3">
            <button
              onClick={markAll}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-sm"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-sm"
            >
              Clear all
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <NotificationList list={paged} onMarkRead={markOne} />
              <div className="flex items-center gap-3 mt-6">
                <label className="text-sm">Per Page:</label>
                <select
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-md"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <div className="ml-auto flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 bg-white/10 rounded-md disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm">Page {page} of {pages}</span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                    className="px-3 py-2 bg-white/10 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
