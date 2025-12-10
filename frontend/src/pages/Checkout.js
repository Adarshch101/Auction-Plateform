import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ProtectedRoute from "../components/ProtectedRoute";

function StepIndicator({ step }) {
  const labels = ["Address", "Review", "Payment"];
  return (
    <div className="flex items-center gap-4 mb-6">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
            i <= step ? "bg-cyan-600 border-cyan-400" : "bg-white/5 border-white/20"
          }`}>{i + 1}</div>
          <span className={`${i === step ? "text-white" : "text-gray-400"}`}>{l}</span>
          {i < labels.length - 1 && <div className="w-10 h-[2px] bg-white/10 mx-2" />}
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial = location.state?.prefill || {};
  const resumeStep = Number.isInteger(location.state?.resumeStep) ? location.state.resumeStep : 0;
  const initialSummary = location.state?.summary || { itemTitle: "Winning Auction Item", amount: 1999 };

  const [step, setStep] = useState(resumeStep);

  const [address, setAddress] = useState({
    name: initial.name || "",
    line1: initial.line1 || "",
    line2: initial.line2 || "",
    city: initial.city || "",
    state: initial.state || "",
    postalCode: initial.postalCode || "",
    country: initial.country || "India",
    phone: initial.phone || "",
  });
  const [summary, setSummary] = useState(initialSummary);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [upi, setUpi] = useState({ vpa: "" });

  // Load address from localStorage (if any)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("checkout_address");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAddress((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // Persist address to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("checkout_address", JSON.stringify(address));
    } catch {}
  }, [address]);

  const validateAddress = () => {
    const req = ["name", "line1", "city", "state", "postalCode", "country", "phone"];
    for (const k of req) {
      if (!address[k]) return false;
    }
    return true;
  };

  const next = () => {
    if (step === 0) {
      if (!validateAddress()) return toast.error("Please fill all required address fields");
      setStep(1);
    } else if (step === 1) {
      if (!agreed) return toast.error("Please accept terms to continue");
      setStep(2);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const validCard = () => {
    // very basic checks
    const num = card.number.replace(/\s+/g, "");
    const expOk = /^\d{2}\/\d{2}$/.test(card.exp);
    const cvcOk = /^\d{3,4}$/.test(card.cvc);
    return num.length >= 12 && card.name && expOk && cvcOk;
  };

  const validUpi = () => /.+@.+/.test(upi.vpa);

  const handlePay = async () => {
    // Mock payment without backend: simulate delay then redirect to Payment Status
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      // Randomize success for demo
      const success = true; // make deterministic for now
      const status = success ? "success" : "failed";
      navigate(`/payment-status`, { state: { status, orderId: "demo-123", amount: summary.amount } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-300 mb-6">Complete your purchase in three simple steps.</p>

        <StepIndicator step={step} />

        {step === 0 && (
          <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" value={address.name} onChange={(v)=>setAddress({...address,name:v})} />
              <Field label="Phone" value={address.phone} onChange={(v)=>setAddress({...address,phone:v})} />
            </div>
            <Field label="Address Line 1" value={address.line1} onChange={(v)=>setAddress({...address,line1:v})} />
            <Field label="Address Line 2" value={address.line2} onChange={(v)=>setAddress({...address,line2:v})} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="City" value={address.city} onChange={(v)=>setAddress({...address,city:v})} />
              <Field label="State" value={address.state} onChange={(v)=>setAddress({...address,state:v})} />
              <Field label="Postal Code" value={address.postalCode} onChange={(v)=>setAddress({...address,postalCode:v})} />
            </div>
            <Field label="Country" value={address.country} onChange={(v)=>setAddress({...address,country:v})} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Review</h2>
            <div className="text-gray-300 text-sm">
              <div><strong>Ship to:</strong> {address.name}, {address.line1}{address.line2?`, ${address.line2}`:""}, {address.city}, {address.state} {address.postalCode}, {address.country}</div>
              <div className="mt-2"><strong>Phone:</strong> {address.phone}</div>
              <div className="mt-4"><strong>Item:</strong> {summary.itemTitle}</div>
              <div><strong>Amount:</strong> ₹{summary.amount}</div>
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" className="accent-cyan-500" checked={agreed} onChange={(e)=>setAgreed(e.target.checked)} />
              <span className="text-sm text-gray-300">I agree to the Terms and Shipping Policies</span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Payment</h2>
            <div className="flex items-center gap-4">
              <label className={`px-4 py-2 rounded-lg border ${paymentMethod==="card"?"border-cyan-400 bg-cyan-600/10":"border-white/10"}`}>
                <input type="radio" name="pm" className="mr-2" checked={paymentMethod==="card"} onChange={()=>setPaymentMethod("card")} />Card
              </label>
              <label className={`px-4 py-2 rounded-lg border ${paymentMethod==="upi"?"border-cyan-400 bg-cyan-600/10":"border-white/10"}`}>
                <input type="radio" name="pm" className="mr-2" checked={paymentMethod==="upi"} onChange={()=>setPaymentMethod("upi")} />UPI
              </label>
              <label className={`px-4 py-2 rounded-lg border ${paymentMethod==="cod"?"border-cyan-400 bg-cyan-600/10":"border-white/10"}`}>
                <input type="radio" name="pm" className="mr-2" checked={paymentMethod==="cod"} onChange={()=>setPaymentMethod("cod")} />COD
              </label>
            </div>
            <p className="text-gray-400 text-sm">Note: Payment is simulated for demo purposes.</p>

            {paymentMethod === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Field label="Card Number" value={card.number} onChange={(v)=>setCard({...card, number:v})} />
                <Field label="Name on Card" value={card.name} onChange={(v)=>setCard({...card, name:v})} />
                <Field label="Expiry (MM/YY)" value={card.exp} onChange={(v)=>setCard({...card, exp:v})} />
                <Field label="CVC" value={card.cvc} onChange={(v)=>setCard({...card, cvc:v})} />
              </div>
            )}
            {paymentMethod === "upi" && (
              <div className="mt-2">
                <Field label="UPI ID (VPA)" value={upi.vpa} onChange={(v)=>setUpi({ vpa: v })} />
                <p className="text-xs text-gray-400 mt-1">Example: username@okbank</p>
              </div>
            )}
            {paymentMethod === "cod" && (
              <div className="text-sm text-yellow-300">Cash on Delivery may not be available for all orders.</div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={back} disabled={step===0} className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50">Back</button>
          {step < 2 ? (
            <button onClick={next} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Continue</button>
          ) : (
            <button
              onClick={handlePay}
              disabled={loading || (paymentMethod==="card" && !validCard()) || (paymentMethod==="upi" && !validUpi())}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading?"Processing...":`Pay ₹${summary.amount}`}
            </button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
}
