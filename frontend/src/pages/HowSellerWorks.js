import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const stepCard = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function HowSellerWorks() {
  const steps = [
    {
      title: "Apply or Upgrade to Seller",
      desc: "Create an account and upgrade to a seller from the Seller Join page. Complete your profile and verification if required.",
      glow: "from-cyan-400 to-indigo-500",
    },
    {
      title: "Create an Auction",
      desc: "Use the Seller Dashboard to create a new auction. Add title, description, images, start/end times, and starting price.",
      glow: "from-indigo-400 to-fuchsia-500",
    },
    {
      title: "Go Live and Receive Bids",
      desc: "Once live, bidders compete in real time. You’ll receive notifications for bids and watchlist activity.",
      glow: "from-emerald-400 to-cyan-400",
    },
    {
      title: "Auction Ends & Winner Selected",
      desc: "When the timer ends, the highest valid bid wins. Orders and notifications are generated automatically.",
      glow: "from-amber-400 to-orange-400",
    },
    {
      title: "Fulfill the Order",
      desc: "Pack securely and ship to the buyer. Upload tracking and keep communication on-platform.",
      glow: "from-rose-400 to-fuchsia-500",
    },
    {
      title: "Get Paid",
      desc: "After delivery or settlement rules, funds are released to your wallet and can be withdrawn to your bank.",
      glow: "from-cyan-400 to-emerald-400",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden px-6 py-20">

      {/* === BACKGROUND SYSTEM === */}
      <div className="absolute inset-0 -z-10">
        {/* command glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22d3ee30,_transparent_45%),radial-gradient(circle_at_bottom,_#a855f730,_transparent_45%)]" />

        {/* grid */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">

        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight
            bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400
            bg-clip-text text-transparent drop-shadow-[0_0_25px_#22d3ee70]">
            How Selling Works
          </h1>

          <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg">
            Your complete seller journey — from onboarding to payout.
            Built for serious sellers on <span className="text-cyan-400">AntiqueXX</span>.
          </p>
        </motion.div>

        {/* === STEPS === */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-10 relative"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={stepCard} className="group relative">

              {/* neon border */}
              <div
                className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r ${step.glow}
                blur opacity-60 group-hover:opacity-100 transition`}
              />

              {/* card */}
              <div className="relative rounded-2xl bg-black/60 backdrop-blur-xl
                border border-white/10 p-8 shadow-[0_0_40px_rgba(34,211,238,0.12)]
                group-hover:shadow-[0_0_60px_rgba(168,85,247,0.25)] transition">

                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/20
                    flex items-center justify-center font-bold text-cyan-400">
                    {i + 1}
                  </div>
                  <h2 className="text-xl font-semibold tracking-wide">
                    {step.title}
                  </h2>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* === PRO TIP === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-yellow-400/50 to-amber-400/50 blur" />
          <div className="relative p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-center">
            💡 <span className="font-semibold">Pro Tip:</span> Listings with professional photos and
            clear condition notes receive up to <span className="text-white font-bold">2× more bids</span>.
          </div>
        </motion.div>
      </div>

      {/* === SELLER HUD === */}
      <div className="fixed bottom-6 right-6 text-xs text-cyan-400 opacity-60 tracking-widest">
        SELLER FLOW: ONLINE
      </div>
    </div>
  );
}
