import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('recently_viewed');
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Recently Viewed</h1>
      {items.length === 0 ? (
        <p className="text-gray-300">No recently viewed items yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it, idx) => (
            <Link key={idx} to={`/auction/${it.id}`} className="border border-white/10 rounded-lg p-3 bg-white/5 hover:bg-white/10 transition block">
              {it.image ? (
                <img src={it.image} alt={it.title || `Item ${idx+1}`} className="w-full h-40 object-cover rounded-md mb-3" loading="lazy" />
              ) : null}
              <div className="font-medium line-clamp-1">{it.title || `Item ${idx+1}`}</div>
              {typeof it.price === 'number' && it.price > 0 && (
                <div className="text-sm text-cyan-300 mt-1">₹{it.price}</div>
              )}
              <div className="text-xs text-gray-400 mt-1">Viewed {new Date(it.viewedAt || Date.now()).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
