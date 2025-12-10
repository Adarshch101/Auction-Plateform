import { useState, useEffect } from "react";
import SellerLayout from "../components/seller/SellerLayout";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SellerSettings() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", storeBio: "", instagram: "", website: "" });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [prefs, setPrefs] = useState({ notifyOnBid: true, notifyOnOrder: true, allowOfferMessages: true, defaultShippingProvider: "Custom", defaultHandlingDays: 3, requireKYC: false, payoutMethod: "bank" });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/auth/me");
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        storeBio: res.data.storeBio || "",
        instagram: res.data.instagram || "",
        website: res.data.website || "",
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      await api.put("/auth/update", { ...form, prefs });
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    }
  }

  async function changePassword() {
    try {
      await api.put("/auth/change-password", passwords);
      toast.success("Password changed");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      toast.error("Password change failed");
    }
  }

  return (
    <SellerLayout>
      <div className="relative min-h-screen pt-28 px-8 max-w-3xl mx-auto text-white">

        {/* 🌌 AURORA BACKGLOW */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-10 left-20 w-[380px] h-[380px] bg-cyan-500 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-purple-700 blur-[160px]" />
        </div>

        {/* ✨ FLOATING PARTICLES */}
        {[...Array(22)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[4px] h-[4px] bg-cyan-300 rounded-full opacity-50"
            initial={{
              x: Math.random() * 900,
              y: Math.random() * 900,
              opacity: 0,
            }}
            animate={{
              y: ["0%", "-180%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 7 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold mb-10
          bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text
          drop-shadow-[0_0_25px_rgba(0,255,255,0.35)]"
        >
          Seller Settings
        </motion.h1>

        {/* ================= ACCOUNT SETTINGS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl mb-10"
        >
          <h3 className="font-bold text-xl mb-6 text-cyan-300">Account Information</h3>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              <Input label="Full Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
              <Input label="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
              <Input label="Phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
              <Input label="Address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} />
              <Input label="Store Bio" value={form.storeBio} onChange={(e)=>setForm({...form,storeBio:e.target.value})} />
              <Input label="Instagram" value={form.instagram} onChange={(e)=>setForm({...form,instagram:e.target.value})} />
              <Input label="Website" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})} />

              <button
                onClick={save}
                className="w-full mt-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 transition font-semibold shadow-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </motion.div>

        {/* ================= PREFERENCES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl mb-10"
        >
          <h3 className="font-bold text-xl mb-6 text-emerald-300">Preferences</h3>
          <Toggle label="Notify on New Bids" checked={prefs.notifyOnBid} onChange={(v)=>setPrefs({...prefs,notifyOnBid:v})} />
          <Toggle label="Notify on Orders" checked={prefs.notifyOnOrder} onChange={(v)=>setPrefs({...prefs,notifyOnOrder:v})} />
          <Toggle label="Allow Offer Messages" checked={prefs.allowOfferMessages} onChange={(v)=>setPrefs({...prefs,allowOfferMessages:v})} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Default Shipping Provider" value={prefs.defaultShippingProvider} onChange={(e)=>setPrefs({...prefs,defaultShippingProvider:e.target.value})} />
            <Input label="Handling Time (days)" value={prefs.defaultHandlingDays} onChange={(e)=>setPrefs({...prefs,defaultHandlingDays:e.target.value})} />
          </div>
        </motion.div>

        {/* ================= PAYOUT & KYC ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl mb-10"
        >
          <h3 className="font-bold text-xl mb-6 text-purple-300">Payout & Verification</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm">Payout Method</label>
              <select
                value={prefs.payoutMethod}
                onChange={(e)=>setPrefs({...prefs,payoutMethod:e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-cyan-400"
              >
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="flex items-end">
              <Toggle label="Require KYC (Account)" checked={prefs.requireKYC} onChange={(v)=>setPrefs({...prefs,requireKYC:v})} />
            </div>
          </div>
        </motion.div>

        {/* ================= PASSWORD SETTINGS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
        >
          <h3 className="font-bold text-xl mb-6 text-yellow-300">Change Password</h3>

          <Input type="password" label="Old Password" value={passwords.oldPassword} onChange={(e)=>setPasswords({...passwords,oldPassword:e.target.value})} />
          <Input type="password" label="New Password" value={passwords.newPassword} onChange={(e)=>setPasswords({...passwords,newPassword:e.target.value})} />

          <button
            onClick={changePassword}
            className="w-full mt-4 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition font-semibold shadow-lg"
          >
            Update Password
          </button>
        </motion.div>
      </div>
    </SellerLayout>
  );
}

/* 🔹 REUSABLE INPUT COMPONENT — GodMode++ */
function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-300 text-sm">{label}</label>
      <input
        {...props}
        className="
          px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white 
          outline-none transition
          focus:border-cyan-400 focus:bg-white/20
          hover:bg-white/15
          shadow-inner"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-8 rounded-full transition ${checked ? "bg-green-500" : "bg-gray-600"}`}
      >
        <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : ""}`} />
      </button>
    </label>
  );
}
