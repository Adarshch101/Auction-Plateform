import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PasswordStrength, { calcPasswordStrength } from "../components/PasswordStrength";
import { motion } from "framer-motion";
import { useSettings } from "../context/SettingsContext";

export default function Register() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const preselectedRole = (searchParams.get("role") || "user").toLowerCase();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Magnetic Button
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all required fields");
      return;
    }

    const { score } = calcPasswordStrength(form.password);
    if (score < 2) {
      toast.error("Password is too weak. Choose a stronger one.");
      return;
    }

    if (settings && settings.enableRegistrations === false) {
      toast.error("Registrations are currently disabled.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, role: preselectedRole };
      await api.post("/auth/register", payload);
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">

      {/* Floating Neon Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[550px] h-[550px] bg-emerald-600 rounded-full blur-3xl -top-40 -left-40 opacity-30"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[450px] h-[450px] bg-blue-500 rounded-full blur-3xl bottom-10 right-10 opacity-25"
      />

      {/* GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 mt-20 backdrop-blur-2xl border border-white/20 
                   rounded-3xl p-10 shadow-[0_0_40px_rgba(255,255,255,0.15)] relative z-10"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto h-14 w-14 rounded-xl  bg-gradient-to-br from-green-500 to-emerald-600 
                     flex items-center justify-center text-xl font-extrabold text-white shadow-lg"
        >
          R
        </motion.div>

        <h1 className="text-3xl text-center font-extrabold mt-6 text-white tracking-wide">
          Create an Account
        </h1>
        {settings && settings.enableRegistrations === false && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm text-center">
            Registrations are temporarily disabled by the administrator.
          </div>
        )}
        <p className="text-center text-gray-300 text-sm mt-2">
          Join <span className="text-emerald-400 font-semibold">AntiqueXX</span> — begin your journey.
        </p>

        {/* NAME */}
        <label className="block text-sm text-gray-300 mt-6 mb-1">Full Name</label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.15 }}
          placeholder="John Doe"
          className="w-full p-3 mb-3 bg-black/40 rounded-lg border border-white/10 
                     text-white shadow-inner outline-none focus:ring-1 focus:ring-emerald-400"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* EMAIL */}
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.15 }}
          placeholder="you@example.com"
          className="w-full p-3 mb-3 bg-black/40 rounded-lg border border-white/10 
                     text-white shadow-inner outline-none focus:ring-1 focus:ring-emerald-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD */}
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <div className="relative">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
            placeholder="Create a strong password"
            type={showPassword ? "text" : "password"}
            className="w-full p-3 mb-2 bg-black/40 rounded-lg border border-white/10 
                       text-white shadow-inner outline-none focus:ring-1 focus:ring-emerald-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-3 text-sm text-emerald-300 hover:text-emerald-400 transition"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* PASSWORD STRENGTH BAR (Already from your component) */}
        <PasswordStrength password={form.password} />

        {/* MAGNETIC REGISTER BUTTON */}
        <motion.button
          onMouseMove={(e) => {
            const rect = e.target.getBoundingClientRect();
            setHoverPos({
              x: e.clientX - rect.left - rect.width / 2,
              y: e.clientY - rect.top - rect.height / 2,
            });
          }}
          onMouseLeave={() => setHoverPos({ x: 0, y: 0 })}
          style={{
            transform: `translate(${hoverPos.x * 0.05}px, ${hoverPos.y * 0.05}px)`
          }}
          onClick={submit}
          disabled={loading || (settings && settings.enableRegistrations === false)}
          className="mt-4 w-full py-3 rounded-xl text-white text-lg font-bold 
                     bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg 
                     shadow-emerald-700/40 hover:shadow-emerald-500/60 active:scale-95 
                     transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </motion.button>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}
