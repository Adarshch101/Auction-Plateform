import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function BuyerProtection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white pt-28 pb-24 px-4">

      {/* === TRUST AURA BACKGROUND === */}
      <div className="absolute inset-0 -z-10">
        {/* soft trust glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22d3ee30,_transparent_45%),radial-gradient(circle_at_bottom,_#4f46e530,_transparent_45%)]" />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">

        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight
            bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-400
            bg-clip-text text-transparent">
            Buyer Protection & Returns
          </h1>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Your purchases are protected with clear policies, transparent
            timelines, and dedicated dispute resolution.
          </p>
        </motion.div>

        {/* === CONTENT CARDS === */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-10"
        >

          {/* WHAT'S COVERED */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-400/40 to-cyan-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">What’s covered</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Item not received or delivered incorrectly.</li>
                <li>Item significantly not as described or defective.</li>
                <li>Transit damage where insured shipping applies.</li>
              </ul>
            </div>
          </motion.div>

          {/* TIMELINES */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-400/40 to-cyan-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">Timelines</h2>
              <p className="text-gray-300 leading-relaxed">
                Issues must be reported within the timeframe shown in your order
                details. Our system guides you through evidence submission and
                resolution steps transparently.
              </p>
            </div>
          </motion.div>

          {/* RETURNS */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-amber-400/40 to-rose-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">Returns & refunds</h2>
              <p className="text-gray-300 leading-relaxed">
                Return eligibility varies by category and seller terms.
                Approved refunds are typically processed within
                <span className="text-white font-semibold"> 5–7 business days</span>.
              </p>
            </div>
          </motion.div>

          {/* HELP */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-400/40 to-indigo-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">How to get help</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Open <span className="text-white">Profile → Orders</span>.</li>
                <li>Select the order and choose contact or dispute.</li>
                <li>Submit details and photos; updates arrive via email & alerts.</li>
              </ul>
            </div>
          </motion.div>

        </motion.section>
      </div>

      {/* === FOOTER TRUST BADGE === */}
      <div className="fixed bottom-6 right-6 text-xs text-cyan-400 opacity-60 tracking-widest">
        PROTECTION STATUS: ACTIVE
      </div>
    </div>
  );
}
