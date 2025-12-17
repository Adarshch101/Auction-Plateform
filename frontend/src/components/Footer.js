import { motion } from "framer-motion";
import { FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-28 pb-12 text-gray-300">

      {/* === GALAXY BACKGROUND (PARALLAX) === */}
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.35] animate-slow-pan" />

      {/* === AURORA OVERLAY === */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(58,0,95,0.5),transparent_60%)] pointer-events-none" />

      {/* === STARDUST GRID === */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.15]" />

      {/* === SHOOTING STARS === */}
      <div className="shooting-star"></div>
      <div className="shooting-star delay-700"></div>
      <div className="shooting-star delay-1500"></div>

      {/* === FLOATING ORBS === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[420px] h-[420px] bg-purple-700/40 blur-[150px] rounded-full -top-32 -left-20"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[380px] h-[380px] bg-cyan-500/40 blur-[140px] rounded-full bottom-10 right-0"
      />

      {/* === CONTENT GRID === */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

        {/* BRAND */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 
                          text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            AntiqueXX
          </h2>

          <p className="mt-3 text-gray-300 leading-relaxed tracking-wide">
            Traversing galaxies of time to bring antique wonders to the modern world.
          </p>

          <div className="mt-6 h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent" />
        </motion.div>

        {/* NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, y: 35 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-white">
            Explore the Universe
          </h3>

          <ul className="space-y-2 mt-4">
            <li>
              <Link 
                to="/auctions"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Live Auctions
              </Link>
            </li>
            <li>
              <Link 
                to="/about"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/collections/astral"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Astral Collections
              </Link>
            </li>
            <li>
              <Link 
                to="/collections/timeless-relics"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Timeless Relics
              </Link>
            </li>
            <li>
              <Link 
                to="/collections/intergalactic-artifacts"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Intergalactic Artifacts
              </Link>
            </li>
            <li>
              <Link 
                to="/curations/cosmic"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Cosmic Curations
              </Link>
            </li>
            <li>
              <Link 
                to="/contact"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Contact Us
              </Link>
            </li>
            <li>
              <Link 
                to="/support"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Support Chat
              </Link>
            </li>
            <li>
              <Link 
                to="/help/buying"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Buyer Guide
              </Link>
            </li>
            <li>
              <Link 
                to="/help/buyer-protection"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Buyer Protection
              </Link>
            </li>
            <li>
              <Link 
                to="/help/seller-handbook"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Seller Handbook
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* SELLER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 35 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.9 }}
        >
          <h3 className="text-xl font-semibold text-white">For Sellers</h3>

          <ul className="space-y-2 mt-4">
            <li>
              <a 
                href="/seller/join"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Become a Seller
              </a>
            </li>
            <li>
              <a 
                href="/seller/dashboard"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Seller Dashboard
              </a>
            </li>
            <li>
              <Link 
                to="/seller/commission-info"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Commission Info
              </Link>
            </li>
            <li>
              <Link 
                to="/seller/shipping-policies"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ Shipping Policies
              </Link>
            </li>
            <li>
              <Link 
                to="/seller/rankings"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ View Seller Rankings
              </Link>
            </li>
            <li>
              <a 
                href="/seller/how-it-works"
                className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center"
              >
                ✦ How Seller Works
              </a>
            </li>
          </ul>
        </motion.div>

        {/* LEGAL & POLICIES */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95 }}
        >
          <h3 className="text-xl font-semibold text-white">Legal & Policies</h3>

          <ul className="space-y-2 mt-4">
            <li>
              <Link to="/legal/terms" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/legal/privacy" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/cookies" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/refunds" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/copyright" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ Copyright / IP
              </Link>
            </li>
            <li>
              <Link to="/legal/user-agreement" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ User Agreement
              </Link>
            </li>
            <li>
              <Link to="/legal/accessibility" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
                ✦ Accessibility Statement
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* UTILITIES */}
        <UtilitiesSection />

        {/* CONTACT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 35 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
        >
          <h3 className="text-xl font-semibold text-white">Contact Mission Control</h3>

          <div className="mt-4 flex flex-col gap-4">
            <p className="flex items-center gap-3 text-gray-300">
              <FiMail className="text-cyan-300" /> support@antiquexx.com
            </p>

            <p className="flex items-center gap-3 text-gray-300">
              <FiPhone className="text-cyan-300" /> +91 9876543210
            </p>

            <p className="text-gray-400 text-sm">Earth Time: Mon–Sat · 10AM – 7PM</p>
          </div>

          <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>
      </div>

      {/* COPYRIGHT */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="relative z-10 text-center mt-16 text-gray-400"
      >
        © {new Date().getFullYear()} AntiqueXX — Beyond Time. Beyond Space.
      </motion.p>

      {/* EXTRA ANIMATIONS */}
      <style>{`
        /* Slow galaxy parallax */
        .animate-slow-pan {
          animation: slowPan 40s linear infinite alternate;
        }
        @keyframes slowPan {
          from { transform: scale(1) translate(0,0); }
          to { transform: scale(1.15) translate(0,-20px); }
        }

        /* Shooting stars */
        .shooting-star {
          position: absolute;
          top: -30px;
          right: -100px;
          width: 3px;
          height: 80px;
          background: linear-gradient(to bottom, rgba(255,255,255,1), transparent);
          opacity: 0.8;
          filter: blur(1px);
          transform: rotate(125deg);
          animation: shoot 3s linear infinite;
        }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1500 { animation-delay: 1.5s; }

        @keyframes shoot {
          0% { transform: translate(0,0) rotate(125deg); opacity: 1; }
          100% { transform: translate(-500px,500px) rotate(125deg); opacity: 0; }
        }
      `}</style>
    </footer>
  );
}

function UtilitiesSection() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    (async () => {
      try {
        await api.post('/newsletter/subscribe', { email });
        toast.success('Subscribed successfully');
        setEmail("");
      } catch (err) {
        const msg = err?.response?.data?.message || 'Subscription failed';
        toast.error(msg);
      }
    })();
  };

  const backToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0 }}
    >
      <h3 className="text-xl font-semibold text-white">Utilities</h3>

      <ul className="space-y-2 mt-4">
        <li>
          <Link to="/sitemap" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
            ✦ Sitemap
          </Link>
        </li>
        <li>
          <button type="button" onClick={backToTop} className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center text-left">
            ✦ Back to top
          </button>
        </li>
        <li>
          <Link to="/recently-viewed" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center">
            ✦ Recently viewed items
          </Link>
        </li>
      </ul>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-200">Newsletter</h4>
        <form onSubmit={onSubscribe} className="mt-2 flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            aria-label="Email address"
            className="w-full px-3 py-2 rounded-md bg-white/10 text-gray-100 placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </motion.div>
  );
}
