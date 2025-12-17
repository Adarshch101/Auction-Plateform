import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function BuyingGuide() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white pt-28 pb-24 px-4">

      {/* === CYBER BACKGROUND === */}
      <div className="absolute inset-0 -z-10">
        {/* animated gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#22d3ee40,transparent_35%),radial-gradient(circle_at_80%_80%,#a855f740,transparent_40%)] animate-pulse" />

        {/* grid */}
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-[scan_6s_linear_infinite]" />
      </div>

      <div className="max-w-5xl mx-auto relative">

        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight
            bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400
            bg-clip-text text-transparent drop-shadow-[0_0_20px_#22d3ee80]">
            BUYER GUIDE
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Decode bidding logic, reserve mechanics, and anti-sniping systems.
            <span className="text-cyan-400"> Win intelligently.</span>
          </p>
        </motion.div>

        {/* === CARDS === */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-10"
        >

          {/* CARD */}
          {[
            {
              title: "Bidding basics",
              content: (
                <ul className="list-disc pl-5 space-y-2">
                  <li>Enter bids directly on the item page.</li>
                  <li>Minimum increments are enforced automatically.</li>
                  <li>Highest valid bid at close secures victory.</li>
                </ul>
              ),
              glow: "from-cyan-400 to-indigo-500",
            },
            {
              title: "Reserve price",
              content: (
                <p>
                  Some auctions have a hidden seller threshold. If bids don’t
                  meet it, the asset remains unsold.
                </p>
              ),
              glow: "from-fuchsia-500 to-purple-500",
            },
            {
              title: "Anti-sniping protocol",
              content: (
                <p>
                  Late bids may extend auction time, preventing last-second
                  exploits and ensuring fair competition.
                </p>
              ),
              glow: "from-emerald-400 to-cyan-400",
            },
            {
              title: "Pro tactics",
              content: (
                <ul className="list-disc pl-5 space-y-2">
                  <li>Define a max bid and never exceed it.</li>
                  <li>Higher prices trigger larger increments.</li>
                  <li>Enable alerts to counter rival bidders.</li>
                </ul>
              ),
              glow: "from-amber-400 to-rose-500",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={card}
              className="group relative"
            >
              {/* neon border */}
              <div
                className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r ${item.glow}
                opacity-60 blur-md group-hover:opacity-100 transition`}
              />

              {/* card */}
              <div className="relative rounded-2xl bg-black/60 backdrop-blur-xl
                border border-white/10 p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]
                group-hover:shadow-[0_0_60px_rgba(168,85,247,0.25)] transition">

                <h2 className="text-xl font-bold mb-3 tracking-wide text-white">
                  {item.title}
                </h2>

                <div className="text-gray-300 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>

      {/* === CORNER HUD === */}
      <div className="fixed bottom-6 right-6 text-xs text-cyan-400 opacity-60 tracking-widest">
        SYSTEM STATUS: ONLINE
      </div>

      {/* === ANIMATION KEYFRAMES === */}
      <style>
        {`
          @keyframes scan {
            0% { background-position-y: 0; }
            100% { background-position-y: 100%; }
          }
        `}
      </style>
    </div>
  );
}
