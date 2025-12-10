import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useFormatCurrency } from "../utils/currency";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const { format } = useFormatCurrency();
  const [form, setForm] = useState({
    shippingName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        setAuction(res.data);
      } catch {
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async () => {
    if (!form.shippingName || !form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country || !form.phone) {
      toast.error("Please fill all required address fields");
      return;
    }
    try {
      await api.post(`/buy/${id}`, form);
      toast.success("Payment successful");
      navigate("/profile");
    } catch (err) {
      const msg = err?.response?.data?.message || "Payment failed";
      toast.error(msg);
    }
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!auction) return <div className="text-white p-10">Item not found</div>;

  return (
    <div className="relative min-h-screen pt-28 px-6 max-w-3xl mx-auto text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(160,70,255,0.35),transparent_65%),radial-gradient(circle_at_80%_80%,rgba(0,200,255,0.3),transparent_65%)]" />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-8"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">Shipping Address</h2>
          <Field label="Full Name *" value={form.shippingName} onChange={(e)=>setForm({...form, shippingName: e.target.value})} />
          <Field label="Address Line 1 *" value={form.addressLine1} onChange={(e)=>setForm({...form, addressLine1: e.target.value})} />
          <Field label="Address Line 2" value={form.addressLine2} onChange={(e)=>setForm({...form, addressLine2: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City *" value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} />
            <Field label="State *" value={form.state} onChange={(e)=>setForm({...form, state: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Postal Code *" value={form.postalCode} onChange={(e)=>setForm({...form, postalCode: e.target.value})} />
            <Field label="Country *" value={form.country} onChange={(e)=>setForm({...form, country: e.target.value})} />
          </div>
          <Field label="Phone *" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">Order Summary</h2>
          <img src={auction.image} alt={auction.title} className="rounded-xl w-full h-40 object-cover mb-4" />
          <p className="font-semibold">{auction.title}</p>
          <p className="text-gray-300 mt-1">Price: {format(auction.buyNowPrice || auction.currentPrice)}</p>
          <button
            onClick={submit}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110"
          >
            Pay {format(auction.buyNowPrice || auction.currentPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-300 block mb-1">{label}</label>
      <input {...props} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none" />
    </div>
  );
}
