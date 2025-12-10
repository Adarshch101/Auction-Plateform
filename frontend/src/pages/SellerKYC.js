import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function SellerKYC() {
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState({ idProof: null, addressProof: null, bankProof: null });
  const [note, setNote] = useState("");
  const { auth, setAuth } = useContext(AuthContext);

  const startVerification = async () => {
    try {
      setSubmitting(true);
      const res = await api.post("/seller/kyc/request");
      toast.success("KYC request submitted");
      // update auth cache if user returned
      if (res.data?.user) {
        const next = { ...(auth || {}), kycRequested: true };
        setAuth && setAuth(next);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit KYC request");
    } finally {
      setSubmitting(false);
    }
  };

  const submitDocuments = async () => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      if (files.idProof) fd.append("idProof", files.idProof);
      if (files.addressProof) fd.append("addressProof", files.addressProof);
      if (files.bankProof) fd.append("bankProof", files.bankProof);
      if (note) fd.append("note", note);
      const res = await api.post("/seller/kyc/submit", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Documents submitted for review");
      if (res.data?.submission) {
        const next = { ...(auth || {}), kycRequested: true };
        setAuth && setAuth(next);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit KYC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 text-white">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Seller Verification (KYC)</motion.h1>
      <p className="text-gray-300 mb-6">To ensure trust and safety on AntiqueXX, sellers may be required to complete a basic verification (KYC).</p>

      <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
        <p className="text-sm text-gray-300">This is a placeholder page. Integrate your preferred KYC provider here or collect minimal details (PAN/GST, address, bank proof) as per your compliance needs.</p>
        <ul className="list-disc list-inside text-gray-300 text-sm">
          <li>Upload ID proof</li>
          <li>Provide address details</li>
          <li>Confirm bank payout details</li>
        </ul>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">ID Proof</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e)=>setFiles(f=>({...f, idProof: e.target.files?.[0]||null}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Address Proof</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e)=>setFiles(f=>({...f, addressProof: e.target.files?.[0]||null}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Bank Proof</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e)=>setFiles(f=>({...f, bankProof: e.target.files?.[0]||null}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Note (optional)</label>
            <textarea rows={3} value={note} onChange={(e)=>setNote(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 outline-none" />
          </div>
        </div>

        <div className="mt-3 flex gap-3 flex-wrap">
          <button onClick={submitDocuments} disabled={submitting} className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Documents"}
          </button>
          <button onClick={startVerification} disabled={submitting} className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50">
            Mark as Requested
          </button>
        </div>
      </div>
    </div>
  );
}
