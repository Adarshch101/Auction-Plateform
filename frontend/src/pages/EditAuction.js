import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";

export default function EditAuction() {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get(`/auctions/${id}`).then((res) => setForm(res.data));
  }, []);

  const submit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);

    await api.put(`/auctions/${id}`, fd);
    toast.success("Updated");
  };

  return (
    <div className="max-w-lg mx-auto p-10">
      <h1 className="text-3xl mb-4">Edit Auction</h1>

      <input className="bg-gray-800 p-2 w-full mb-3"
        value={form.title || ""} onChange={(e)=>setForm({...form,title:e.target.value})} />

      <textarea className="bg-gray-800 p-2 w-full mb-3"
        value={form.description || ""} onChange={(e)=>setForm({...form,description:e.target.value})}></textarea>

      <input type="number" className="bg-gray-800 p-2 w-full mb-3"
        value={form.startingPrice || ""} onChange={(e)=>setForm({...form,startingPrice:e.target.value})} />

      <input type="number" className="bg-gray-800 p-2 w-full mb-3"
        value={form.buyNowPrice || ""} onChange={(e)=>setForm({...form,buyNowPrice:e.target.value})} />

      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

      <button className="w-full bg-blue-600 py-2 mt-4" onClick={submit}>
        Update Auction
      </button>
    </div>
  );
}
