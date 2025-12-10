import { motion } from "framer-motion";
import { FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

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
      <div className="relative z-10 max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-14">

        {/* BRAND */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 
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
