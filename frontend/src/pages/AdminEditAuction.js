import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/admin/AdminLayout";
import { useSettings } from "../context/SettingsContext";

export default function AdminEditAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { settings } = useSettings();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    startingPrice: "",
    buyNowPrice: "",
    currentPrice: "",
    quantity: 0,
    status: "upcoming",
    startTime: "",
    endTime: "",
    featured: false,
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/auctions/${id}`);
        const a = res.data;
        setForm({
          title: a.title || "",
          description: a.description || "",
          category: a.category || "general",
          startingPrice: a.startingPrice ?? "",
          buyNowPrice: a.buyNowPrice ?? "",
          currentPrice: a.currentPrice ?? "",
          quantity: a.quantity ?? 0,
          status: a.status || "upcoming",
          startTime: a.startTime ? new Date(a.startTime).toISOString().slice(0,16) : "",
          endTime: a.endTime ? new Date(a.endTime).toISOString().slice(0,16) : "",
          featured: !!a.featured,
        });
      } catch (e) {
        toast.error("Failed to load auction");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const onFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const submit = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      if (files && files.length) {
        files.forEach((f) => fd.append("images", f));
      }
      await api.put(`/auctions/${id}`, fd);
      toast.success("Auction updated");
      navigate(-1);
    } catch (e) {
      toast.error("Failed to update auction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto pt-24 px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Auction</h1>
          <button onClick={() => navigate(-1)} className="px-3 py-2 bg-white/10 rounded-md">Back</button>
        </div>

        {loading ? (
          <div className="opacity-70">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.title} onChange={onChange('title')} />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea className="w-full bg-white/10 border border-white/20 rounded-md p-2" rows={4} value={form.description} onChange={onChange('description')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.category} onChange={onChange('category')} />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.status} onChange={onChange('status')}>
                  <option value="upcoming">upcoming</option>
                  <option value="active">active</option>
                  <option value="ended">ended</option>
                  <option value="bought">bought</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Starting Price</label>
                <input type="number" className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.startingPrice} onChange={onChange('startingPrice')} />
              </div>
              <div>
                <label className="block text-sm mb-1">Buy Now Price</label>
                <input type="number" className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.buyNowPrice} onChange={onChange('buyNowPrice')} />
              </div>
              <div>
                <label className="block text-sm mb-1">Current Price</label>
                <input type="number" className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.currentPrice} onChange={onChange('currentPrice')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <input type="number" className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.quantity} onChange={onChange('quantity')} />
              </div>
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <input type="datetime-local" className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.startTime} onChange={onChange('startTime')} />
              </div>
              <div>
                <label className="block text-sm mb-1">End Time</label>
                <input type="datetime-local" className="w-full bg-white/10 border border-white/20 rounded-md p-2" value={form.endTime} onChange={onChange('endTime')} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input id="featured" type="checkbox" checked={form.featured} onChange={onChange('featured')} />
              <label htmlFor="featured">Featured</label>
            </div>

            <div>
              <label className="block text-sm mb-1">Upload Images (optional)</label>
              <input type="file" multiple onChange={onFiles} />
            </div>

            <div className="pt-4">
              <button disabled={saving || !!settings?.maintenanceMode} onClick={submit} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
