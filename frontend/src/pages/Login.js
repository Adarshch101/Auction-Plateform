import { useState, useContext, useEffect } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [otpPhase, setOtpPhase] = useState(false);
  const [otp, setOtp] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSeconds, setOtpSeconds] = useState(0);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  // Magnetic button effect
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const submit = async () => {
    // Phase 1: email/password
    if (!otpPhase) {
      if (!form.email || !form.password) {
        toast.error("Please enter email and password");
        return;
      }
      setLoading(true);
      try {
        const res = await api.post("/auth/login", form);
        if (res.data?.require2fa) {
          setOtpPhase(true);
          toast.success("OTP sent to your email");
          const expiresAt = Date.now() + 60 * 1000;
          setOtpExpiresAt(expiresAt);
          setOtpSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
          return;
        }
        login(res.data.token, res.data.role, res.data.userId);
        toast.success("Logged in successfully");
        const next = searchParams.get("next");
        navigate(next || "/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Invalid credentials");
      } finally {
        setLoading(false);
      }
      return;
    }
    // Phase 2: OTP verify
    if (!otp.trim()) {
      toast.error("Enter the OTP sent to your email");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { ...form, otp: otp.trim() });
      login(res.data.token, res.data.role, res.data.userId);
      toast.success("Logged in successfully");
      const next = searchParams.get("next");
      navigate(next || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // countdown for OTP expiry based on absolute timestamp
  useEffect(() => {
    if (!otpPhase || !otpExpiresAt) return;
    const id = setInterval(() => {
      const remain = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setOtpSeconds(remain);
    }, 1000);
    // initialize immediately as well
    const remainNow = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
    setOtpSeconds(remainNow);
    return () => clearInterval(id);
  }, [otpPhase, otpExpiresAt]);

  const handleResend = async () => {
    if (resendLoading) return;
    if (!form.email || !form.password) {
      toast.error("Enter email and password first");
      return;
    }
    setResendLoading(true);
    try {
      await api.post("/auth/login", form);
      setOtp("");
      const expiresAt = Date.now() + 60 * 1000;
      setOtpExpiresAt(expiresAt);
      setOtpSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
      toast.success("A new OTP has been sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">

      {/* Floating Orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 3 }}
        className="absolute w-[550px] h-[550px] bg-purple-600 rounded-full blur-3xl opacity-30 -top-40 -left-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 3 }}
        className="absolute w-[450px] h-[450px] bg-blue-500 rounded-full blur-3xl opacity-25 bottom-20 right-10"
      />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 mt-20 backdrop-blur-2xl border border-white/20 
                   rounded-3xl p-10 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 
                     flex items-center justify-center text-xl font-extrabold text-white shadow-lg"
        >
          A
        </motion.div>

        <h1 className="text-3xl text-center font-extrabold mt-6 text-white tracking-wide">
          Welcome Back
        </h1>
        <p className="text-center text-gray-300 text-sm mt-1">
          Sign in to continue
        </p>

        {/* Email Input */}
        <label className="block text-sm text-gray-300 mt-6 mb-1">Email</label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          placeholder="you@example.com"
          className="w-full p-3 mb-4 bg-black/40 rounded-lg border border-white/10 
                     text-white shadow-inner outline-none focus:ring-1 focus:ring-purple-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password Input */}
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <div className="relative">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            placeholder="Your password"
            type={showPassword ? "text" : "password"}
            className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white 
                       shadow-inner outline-none focus:ring-1 focus:ring-purple-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-3 text-sm text-purple-300 hover:text-purple-400 transition"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* OTP input (2FA) */}
        {otpPhase && (
          <>
            <label className="block text-sm text-gray-300 mt-4 mb-1">OTP</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              placeholder="6-digit code"
              className="w-full p-3 bg-black/40 rounded-lg border border-white/10 text-white 
                         shadow-inner outline-none focus:ring-1 focus:ring-purple-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-300">
                Expires in {String(Math.floor(otpSeconds / 60)).padStart(2, "0")}:
                {String(otpSeconds % 60).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={otpSeconds > 0 || resendLoading}
                className={`px-3 py-1 rounded-md border border-white/20 text-white transition ${
                  otpSeconds > 0 || resendLoading
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:bg-white/10"
                }`}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {/* Login/Verify Button - Magnetic Hover Effect */}
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
            transform: `translate(${hoverPos.x * 0.1}px, ${hoverPos.y * 0.1}px)`,
          }}
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl text-white text-lg font-bold 
                     bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-700/40 
                     hover:shadow-purple-500/60 active:scale-95 transition disabled:opacity-50"
        >
          {loading ? "Authenticating..." : otpPhase ? "Verify OTP" : "Login"}
        </motion.button>

        {/* Register Link */}
        <div className="mt-5 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Create one
          </a>
        </div>
      </motion.div>
    </div>
  );
}
