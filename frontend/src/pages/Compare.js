import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";

export default function Compare() {
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("compareList") || "[]");
      if (Array.isArray(saved)) setIds(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (!ids || ids.length === 0) { setItems([]); setLoading(false); return; }
    setLoading(true);
    Promise.all(ids.map((id) => api.get(`/auctions/${id}`).then(r => r.data).catch(()=>null)))
      .then(list => setItems(list.filter(Boolean)))
      .finally(()=> setLoading(false));
  }, [ids]);

  function remove(id) {
    const next = ids.filter(x => x !== id);
    setIds(next);
    try { localStorage.setItem("compareList", JSON.stringify(next)); } catch {}
  }

  if (loading) return <div className="min-h-screen pt-24 px-6 text-white">Loading…</div>;

  return (
    <div className="min-h-screen pt-24 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">Compare Items</h1>
        {items.length === 0 ? (
          <p className="text-gray-400">No items selected. Go to Auctions and tick "Compare" on cards.</p>
        ) : (
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(220px, 1fr))` }}>
            {items.map((a) => (
              <div key={a._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <img src={Array.isArray(a.images) && a.images[0] ? a.images[0] : a.image} className="w-full h-40 object-cover rounded-lg" />
                <div className="mt-3 font-semibold line-clamp-2">{a.title}</div>
                <div className="text-sm text-gray-300 mt-1">Category: {a.category}</div>
                <div className="text-sm mt-1">Current: <span className="text-cyan-300 font-semibold">₹{a.currentPrice}</span></div>
                {typeof a.reservePrice === 'number' && a.reservePrice > 0 && (
                  <div className="text-xs mt-1">{Number(a.currentPrice) >= Number(a.reservePrice) ? <span className="text-emerald-300">Reserve met</span> : <span className="text-yellow-300">Reserve not met (₹{a.reservePrice})</span>}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">Ends: {new Date(a.endTime).toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Seller: {a.seller?.name || a.sellerId?.name || "—"}</div>

                <div className="mt-3 flex gap-2">
                  <Link to={`/auction/${a._id}`} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-sm">Open</Link>
                  <button onClick={()=> remove(a._id)} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
