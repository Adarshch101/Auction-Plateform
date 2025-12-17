import { useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import CaptchaCheckbox from "../components/ui/CaptchaCheckbox";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [msgCount, setMsgCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message") {
      if (value.length > 2000) return;
      setMsgCount(value.length);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!captchaOk) {
      toast.error("Please verify the CAPTCHA");
      return;
    }
    try {
      setLoading(true);
      await api.post("/contact", form);
      toast.success("Thanks for contacting us! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setCaptchaOk(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-6 py-16">

      {/* --- Soft background glow --- */}
      <div className="absolute inset-0 -z-10 opacity-30 bg-gradient-to-b from-cyan-600/20 via-blue-900/20 to-black blur-3xl" />

      {/* --- Title --- */}
      <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
        Contact Us
      </h1>
      <p className="text-gray-300 mb-10 text-lg leading-relaxed">
        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>

      {/* --- Glassmorphism GODMODE Card --- */}
      <form
        onSubmit={handleSubmit}
        className="
          relative p-8 rounded-2xl overflow-hidden 
          backdrop-blur-xl bg-white/10 
          shadow-[0_0_60px_-15px_rgba(0,200,255,0.3)] 
          border border-white/20
          animate-[float_6s_ease-in-out_infinite]
        "
      >

        {/* Animated border frame */}
        <div className="absolute inset-0 rounded-2xl border-[1px] border-transparent 
          bg-[linear-gradient(135deg,rgba(0,200,255,0.5),rgba(0,100,255,0.2))] 
          opacity-20 pointer-events-none" />

        {/* Noise texture */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* --- Inputs --- */}
        {["name", "email", "subject"].map((field) => (
          <div key={field} className="group">
            <label className="block text-sm mb-1 text-gray-300 capitalize">{field}</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className="
                w-full bg-black/30 border border-white/20 text-white 
                rounded-xl px-4 py-3
                transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-cyan-400 
                focus:border-cyan-400
                group-hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]
              "
            />
          </div>
        ))}

        {/* --- Message box --- */}
        <div className="group">
          <label className="block text-sm mb-1 text-gray-300">Message</label>
          <textarea
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us more..."
            className="
              w-full bg-black/30 border border-white/20 text-white 
              rounded-xl px-4 py-3
              transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-cyan-400 
              focus:border-cyan-400
              resize-none
              group-hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]
            "
          />
          <div className="text-xs text-cyan-300/70 mt-1 text-right">
            {msgCount}/2000
          </div>
        </div>

        {/* --- Submit + Captcha Row --- */}
        <div className="flex items-center justify-between pt-4">
          <CaptchaCheckbox onChange={setCaptchaOk} />

          <button
            type="submit"
            disabled={loading}
            className="
              relative px-6 py-3 rounded-xl 
              font-semibold tracking-wide 
              bg-gradient-to-r from-cyan-500 to-blue-600 
              shadow-[0_0_15px_rgba(0,200,255,0.7)]
              hover:shadow-[0_0_25px_rgba(0,200,255,1)]
              transition-all duration-300
              disabled:opacity-60 
              animate-pulse
              text-white
            "
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
