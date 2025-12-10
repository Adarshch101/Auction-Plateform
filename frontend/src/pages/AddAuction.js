import { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";

export default function AddAuction() {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  const submit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);

    await api.post("/auctions", fd);
    toast.success("Auction created");
  };

  return (
    <div className="max-w-lg mx-auto p-10">
      <h1 className="text-3xl mb-4">Add Auction</h1>

      <input className="bg-gray-800 p-2 w-full mb-3" placeholder="Title"
        onChange={(e)=>setForm({...form,title:e.target.value})} />

      <textarea className="bg-gray-800 p-2 w-full mb-3" placeholder="Description"
        onChange={(e)=>setForm({...form,description:e.target.value})}></textarea>

      <input type="number" className="bg-gray-800 p-2 w-full mb-3"
        placeholder="Starting Price"
        onChange={(e)=>setForm({...form,startingPrice:e.target.value})} />

      <input type="number" className="bg-gray-800 p-2 w-full mb-3"
        placeholder="Buy Now Price"
        onChange={(e)=>setForm({...form,buyNowPrice:e.target.value})} />

      <input type="file" className="mb-4" onChange={(e)=>setFile(e.target.files[0])} />

      <button className="w-full bg-green-600 py-2 rounded" onClick={submit}>
        Create Auction
      </button>
    </div>
  );
}
