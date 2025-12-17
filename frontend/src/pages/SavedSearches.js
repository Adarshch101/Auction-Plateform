import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function SavedSearches() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/saved-searches');
      setItems(res.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const runSearch = (s) => {
    const q = new URLSearchParams();
    const query = s.query || {};
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.append(k, v);
    });
    window.location.href = `/auctions?${q.toString()}`;
  };

  useEffect(() => { load(); }, []);

  const toggleNotif = async (id, v) => {
    try {
      await api.put(`/saved-searches/${id}`, { notifications: v });
      setItems((prev)=> prev.map(x=> x._id===id ? { ...x, notifications: v } : x));
    } catch {}
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this saved search?')) return;
    try {
      await api.delete(`/saved-searches/${id}`);
      setItems((prev)=> prev.filter(x=> x._id!==id));
    } catch {}
  };

  return (
    <div className="min-h-screen pt-24 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">Saved Searches</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-400">No saved searches yet. Go to Auctions and click "Save this search".</p>
        ) : (
          <div className="space-y-3">
            {items.map((s) => (
              <div key={s._id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{s.name || 'Saved Search'}</div>
                  <div className="text-xs text-gray-400 mt-1">{Object.entries(s.query||{}).filter(([,v])=> v!==undefined && v!==null && v!=='').map(([k,v])=> `${k}=${v}`).join(', ') || 'No filters'}</div>
                  <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={!!s.notifications} onChange={(e)=> toggleNotif(s._id, e.target.checked)} />
                    Alerts enabled
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=> runSearch(s)} className="px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 hover:bg-white/20">Run search</button>
                  <button onClick={()=> remove(s._id)} className="px-3 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
