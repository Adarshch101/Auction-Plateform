import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

/* ---------------------------------------------------
   ⭐ FULLSCREEN ROTATING ARTIFACT (SINGLE ELEMENT)
--------------------------------------------------- */
function FullscreenArtifact() {
  return (
    <motion.img
      src="https://th.bing.com/th/id/OIP.6e3jAiIMBKCluT19rYnVBwHaE7?w=242&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
      className="fixed inset-0 w-full h-full object-contain opacity-[0.12] pointer-events-none select-none"
      style={{
        zIndex: 0,
        filter: "drop-shadow(0 0 45px rgba(150,0,255,0.4))",
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 45,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

/* ---------------------------------------------------
   ⭐ DEFAULT IMAGES (No placeholders)
--------------------------------------------------- */
const FEATURED_ITEM =
  "https://th.bing.com/th/id/OIP.jRip9ThyBRUfUusm531MxgHaHa?w=150&h=180&c=7&r=0&o=7&pid=1.7";
const ARCANE_HOLOGRAM =
  "https://th.bing.com/th/id/OIP.WCMDcv8B0Q56Lr2QZiR-EAHaEK?w=271&h=180&c=7&r=0&o=7&pid=1.7";
const CATEGORY_ART =
  "https://th.bing.com/th/id/OIP.5UeONQgTywWzIMUh4DxgzQHaEo?w=290&h=181&c=7&r=0&o=7&pid=1.7";
const CATEGORY_RARE =
  "https://th.bing.com/th/id/OIP.XQbm5f9tGGLKD68-vRyo9AHaEJ?w=329&h=180&c=7&r=0&o=7&pid=1.7";
const CATEGORY_VINTAGE =
  "https://th.bing.com/th/id/OIP.Y4G_o2S6Msc9whYzOo4chwHaE7?w=276&h=184&c=7&r=0&o=7&pid=1.7";

/* ---------------------------------------------------
   ⭐ HOME COMPONENT
--------------------------------------------------- */
export default function Home() {
  const reviews = [
    { name: "Amit Sharma", text: "Amazing platform! I won a rare Mughal coin set.", rating: 5 },
    { name: "Sophia Patel", text: "Clean UI and smooth bidding experience!", rating: 5 },
    { name: "Jay Verma", text: "Feels like a premium auction house!", rating: 4 },
  ];

  const [currentReview, setCurrentReview] = useState(0);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  /* Review auto-rotation */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  /* Fetch auctions */
  const fetchAuctions = async () => {
    try {
      const res = await api.get("/auctions");
      const all = res.data || [];
      const now = new Date();

      setLiveAuctions(all.filter((a) => a.status === "active" && new Date(a.endTime) > now));
      setUpcoming(all.filter((a) => new Date(a.startTime) > now));
      setCompleted(all.filter((a) => a.status === "ended"));

      // Featured
      try {
        const fres = await api.get("/auctions/featured");
        setFeatured(fres.data || []);
      } catch {}

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <PageWrapper>
      <div className="relative min-h-screen bg-[#04010a] text-white overflow-hidden">

        {/* ⭐ FULLSCREEN ROTATING ARTIFACT */}
        <FullscreenArtifact />

        {/* CYBERPUNK CITY NEON LAYER */}
        <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.JnMo0wcvgjoxmzQ0gSMTsgHaEK?w=311&h=180&c=7&r=0&o=7&pid=1.7')] 
                        bg-cover bg-center opacity-[0.17] mix-blend-screen" />

        {/* PURPLE & PINK AURAS */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(140,60,255,0.35),transparent_70%),
                                             radial-gradient(circle_at_80%_70%,rgba(255,60,190,0.25),transparent_60%)] pointer-events-none" />

        {/* FLOATING PARTICLES */}
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[10px] bg-purple-400/70 rounded-full"
            initial={{ x: Math.random() * 2000, y: Math.random() * 1500, opacity: 0 }}
            animate={{ y: ["0%", "-130%"], opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 7 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* CYBERPUNK RAIN */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={"rain" + i}
            className="absolute w-[1px] h-[70px] bg-purple-300/30 blur-[1px]"
            initial={{ x: Math.random() * 1800, y: -200 }}
            animate={{ y: "1600px" }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 0.8 + 0.5,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* ROTATING ARCANE CIRCLE */}
        <motion.img
          src={ARCANE_HOLOGRAM}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] opacity-[0.13]"
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        {/* -------------------------------
            HERO SECTION
        -------------------------------- */}
        <section className="relative pt-32 pb-28 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

            {/* LEFT TEXT BLOCK */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-purple-300 text-sm font-semibold tracking-widest"
              >
                CyberMystic Auction System
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-5xl md:text-6xl font-extrabold leading-tight"
              >
                Bid on  
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-violet-300 
                                 text-transparent bg-clip-text">
                  {" "}Enchanted Artifacts
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-6 text-gray-300 text-lg max-w-xl"
              >
                Where neon technology meets ancient magic.  
                Discover relics charged with mystic energy and cyber-enhanced value.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link
                  to="/auctions"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 
                             hover:brightness-110 shadow-lg shadow-pink-500/30 font-semibold"
                >
                  Explore Auctions
                </Link>

                <Link
                  to="/wallet"
                  className="px-7 py-3 rounded-xl border border-white/15 hover:bg-white/10 
                             backdrop-blur-md"
                >
                  Add Funds
                </Link>
              </motion.div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                <Stat num="500+" label="Mystic Sellers" />
                <Stat num="10K+" label="Energy Bids" />
                <Stat num="24/7" label="Live Relics" />
              </div>
            </div>

            {/* RIGHT IMAGE HOLOGRAM */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative select-none z-10"
              style={{ perspective: "1200px" }}
            >
              <motion.img
                src={FEATURED_ITEM}
                className="rounded-3xl border border-purple-500/20 
                           shadow-[0_0_45px_rgba(160,0,255,0.35)]"
                whileHover={{
                  rotateY: 10,
                  rotateX: -6,
                  scale: 1.04,
                  transition: { type: "spring", stiffness: 140 },
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 bg-white/10 border border-purple-400/30 
                           backdrop-blur-md px-4 py-2 rounded-xl text-sm"
              >
                Arcane Time Relic (1890)
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* -------------------------------
            FEATURED AUCTIONS
        -------------------------------- */}
        {featured && featured.length > 0 && (
          <section className="px-6 py-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              🌟 Featured
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featured.slice(0, 6).map((a, i) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-white/5 border border-yellow-500/20 hover:bg-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(255,215,0,0.15)] transition"
                >
                  {a.image && (
                    <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                  )}
                  <p className="font-semibold text-yellow-200">{a.title}</p>
                  <p className="text-gray-300 text-sm line-clamp-2 mt-1">{a.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Link
                      to={`/auction/${a._id}`}
                      className="text-yellow-200 hover:text-yellow-100 transition"
                    >
                      View →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* -------------------------------
            TRENDING CATEGORIES
        -------------------------------- */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 drop-shadow-[0_0_20px_rgba(200,0,255,0.5)]">
            🔥 Trending Categories
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <CategoryCard img={CATEGORY_ART} title="Ancient Artifacts" subtitle="Rare, historic & mystical pieces" />
            <CategoryCard img={CATEGORY_RARE} title="Rare Metals" subtitle="Gold, Silver & Astral alloys" />
            <CategoryCard img={CATEGORY_VINTAGE} title="Vintage Relics" subtitle="Timeless collectibles from past eras" />
          </div>
        </section>

        {/* -------------------------------
            FEATURED SELLERS
        -------------------------------- */}
        <section className="px-6 py-16 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 drop-shadow-[0_0_18px_rgba(150,0,255,0.6)]">
            🏆 Featured Sellers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {["ArcaneTrader", "MysticVault", "VintageMaharaja"].map((name, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 bg-white/5 border border-purple-500/20 rounded-2xl backdrop-blur-xl
                           hover:bg-white/10 transition shadow-lg"
              >
                <p className="text-xl font-semibold text-purple-300">{name}</p>
                <p className="text-gray-400 mt-2">Trusted seller with premium relics</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* -------------------------------
            WHY CHOOSE US
        -------------------------------- */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 drop-shadow-[0_0_15px_rgba(200,0,255,0.6)]">
            💠 Why Choose CyberMystic?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <Feature title="Secure Auctions" desc="Encrypted bidding protection." />
            <Feature title="Verified Sellers" desc="Every seller is identity-verified." />
            <Feature title="Mystic Valuation" desc="Smart AI relic-value analysis." />
            <Feature title="Fast Withdrawals" desc="Instant payout to your wallet." />
          </div>
        </section>

        {/* -------------------------------
            HOW IT WORKS
        -------------------------------- */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 drop-shadow-[0_0_10px_rgba(200,0,255,0.6)]">
            🌀 How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Browse Relics", desc: "Choose from rare & enchanted artifacts." },
              { step: "2", title: "Place Your Bid", desc: "Bid live with real-time neon UI." },
              { step: "3", title: "Win Magical Items", desc: "Collect artifacts infused with ancient power." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-xl"
              >
                <p className="text-4xl font-bold text-purple-300">{s.step}</p>
                <p className="text-xl font-semibold mt-2">{s.title}</p>
                <p className="text-gray-300 mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* -------------------------------
            AUCTION SECTIONS
        -------------------------------- */}
        <AuctionSection title="⚡ Live Auctions" list={liveAuctions} loading={loading} />
        <AuctionSection title="🔮 Upcoming Relics" list={upcoming} loading={loading} upcoming />
        <AuctionSection title="✔ Completed Trades" list={completed} loading={loading} completed />

        {/* -------------------------------
            USER REVIEWS
        -------------------------------- */}
        <section className="px-6 py-20 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 drop-shadow-[0_0_15px_rgba(200,0,255,0.6)]">
            ⭐ User Feedback
          </h2>

          <motion.div
            key={currentReview}
            initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="p-8 bg-white/5 border border-purple-500/20 rounded-3xl 
                       shadow-[0_0_35px_rgba(200,0,255,0.15)] backdrop-blur-xl"
          >
            <p className="text-xl text-gray-200 italic">
              “{reviews[currentReview].text}”
            </p>
            <p className="mt-4 font-semibold text-purple-300">{reviews[currentReview].name}</p>
            <p className="text-yellow-300 text-sm mt-1">
              {"⭐".repeat(reviews[currentReview].rating)}
            </p>
          </motion.div>
        </section>

        {/* -------------------------------
            NEWSLETTER
        -------------------------------- */}
        <section className="px-6 pb-32 max-w-4xl mx-auto">
          <div className="p-10 rounded-3xl bg-white/5 border border-purple-500/20 backdrop-blur-xl
                          shadow-[0_0_35px_rgba(200,0,255,0.15)] text-center">
            <h2 className="text-3xl font-bold mb-4">✨ Join the Mystic Newsletter</h2>
            <p className="text-gray-300 mb-6">
              Get alerts for rare relic drops, price trends & secret auctions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl 
                           backdrop-blur-md outline-none w-full sm:w-72"
              />
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 
                                 font-semibold hover:brightness-110">
                Subscribe
              </button>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}

/* ---------------------------------------------------
   ⭐ Reusable Components
--------------------------------------------------- */

function Stat({ num, label }) {
  return (
    <div>
      <p className="text-3xl font-bold drop-shadow-[0_0_6px_rgba(200,0,255,0.8)]">{num}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}

function CategoryCard({ img, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden bg-white/5 border border-purple-500/20 backdrop-blur-xl
                 shadow-[0_0_20px_rgba(200,0,255,0.15)] hover:scale-[1.03] transition"
    >
      <img src={img} className="w-full h-48 object-cover opacity-80" alt="" />
      <div className="p-5">
        <p className="text-xl font-semibold text-purple-200">{title}</p>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-xl shadow-lg">
      <p className="text-xl font-semibold text-purple-200">{title}</p>
      <p className="text-gray-300 mt-2">{desc}</p>
    </div>
  );
}

function AuctionSection({ title, list, loading, upcoming, completed }) {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 drop-shadow-[0_0_12px_rgba(180,0,255,0.5)]">
        {title}
      </h2>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 border border-purple-500/20 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No items available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {list.slice(0, 3).map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 
                         hover:bg-white/10 shadow-[0_0_25px_rgba(200,0,255,0.1)] 
                         backdrop-blur-xl transition group"
            >
              <p className="font-semibold text-purple-200">{a.title}</p>

              {upcoming && (
                <p className="text-gray-300 text-sm">
                  Starts: {new Date(a.startTime).toLocaleString()}
                </p>
              )}

              {completed && (
                <p className="text-purple-300 text-sm">Sold: ₹{a.currentPrice}</p>
              )}

              {!upcoming && !completed && (
                <>
                  <p className="text-purple-300 text-sm">₹{a.currentPrice}</p>
                  <p className="text-xs text-pink-400">LIVE</p>
                </>
              )}

              <div className="flex items-center gap-4 mt-4">
                <Link
                  to={`/auction/${a._id}`}
                  className="text-purple-200 group-hover:text-purple-100 transition"
                >
                  View →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
