import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SellerJoin() {
  const navigate = useNavigate();
  const { auth, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "upgrade" && auth?.token) {
      upgrade();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upgrade = async () => {
    try {
      setLoading(true);
      const { data } = await api.put("/auth/become-seller");
      const stored = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = stored.token || auth?.token;
      // update auth context/local storage with new role
      login(token, "seller", stored.userId || auth?.userId || null);
      toast.success("You're now a seller!");
      navigate("/seller/dashboard", { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to upgrade");
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">Become a Seller</h1>
          <p className="text-gray-300 mb-6">Login or create an account to continue.</p>
          <div className="flex items-center justify-center gap-3">
            <a className="px-4 py-2 rounded bg-emerald-600" href="/login?next=/seller/join?action=upgrade">Login</a>
            <a className="px-4 py-2 rounded bg-blue-600" href="/register?role=seller">Register as Seller</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Upgrade to Seller</h1>
        <p className="text-gray-300 mb-6">Click below to enable seller features on your account.</p>
        <button onClick={upgrade} disabled={loading} className="px-5 py-2 rounded bg-emerald-600 disabled:opacity-60">
          {loading ? "Upgrading..." : "Become a Seller"}
        </button>
      </div>
    </div>
  );
}
