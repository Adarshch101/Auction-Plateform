import { useLocation, Link, useNavigate } from "react-router-dom";

export default function PaymentStatus() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const status = state?.status || "unknown";
  const orderId = state?.orderId || "";
  const amount = state?.amount || 0;

  const ok = status === "success";

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-white text-center">
      <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${ok ? "bg-emerald-600/20 border border-emerald-400/30" : "bg-red-600/20 border border-red-400/30"}`}>
        <span className={`text-3xl ${ok ? "text-emerald-300" : "text-red-300"}`}>{ok ? "✓" : "✕"}</span>
      </div>
      <h1 className="text-3xl font-bold mt-4">{ok ? "Payment Successful" : "Payment Failed"}</h1>
      <p className="text-gray-300 mt-2">
        {ok ? "Your order has been placed." : "Your payment could not be processed."}
      </p>
      <div className="mt-6 text-sm text-gray-400">
        {orderId && <div><strong>Order ID:</strong> {orderId}</div>}
        {amount ? <div><strong>Amount:</strong> ₹{amount}</div> : null}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link to="/" className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20">Go Home</Link>
        <Link to="/seller/orders" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">View Orders</Link>
        {!ok && (
          <button
            onClick={() => navigate('/checkout', { state: { resumeStep: 2, summary: { amount } } })}
            className="px-5 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
