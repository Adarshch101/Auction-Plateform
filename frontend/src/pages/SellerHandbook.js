import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function SellerHandbook() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white pt-28 pb-24 px-4">

      {/* === SELLER POWER BACKGROUND === */}
      <div className="absolute inset-0 -z-10">
        {/* gradient authority aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f59e0b30,_transparent_45%),radial-gradient(circle_at_bottom,_#22d3ee30,_transparent_45%)]" />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">

        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight
            bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400
            bg-clip-text text-transparent">
            Seller Handbook
          </h1>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Elite practices for professional listings, secure fulfillment,
            and dispute-free selling.
          </p>
        </motion.div>

        {/* === CARDS === */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-10"
        >

          {/* LISTING STANDARDS */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-amber-400/40 to-orange-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">Listing standards</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Use precise titles with condition and authenticity details.</li>
                <li>Upload high-resolution photos showing all angles and flaws.</li>
                <li>Select accurate categories and complete item attributes.</li>
              </ul>
            </div>
          </motion.div>

          {/* PROHIBITED ITEMS */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-rose-400/40 to-amber-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">Prohibited items</h2>
              <p className="text-gray-300 leading-relaxed">
                Adhere strictly to regulations covering cultural heritage,
                endangered materials, and restricted exports. When uncertain,
                contact support before listing.
              </p>
            </div>
          </motion.div>

          {/* SHIPPING */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-400/40 to-emerald-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">Shipping & packaging</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Use protective materials and tamper-evident seals.</li>
                <li>Always ship with tracking and insurance when applicable.</li>
                <li>Dispatch quickly and upload tracking to maintain trust.</li>
              </ul>
            </div>
          </motion.div>

          {/* DISPUTES */}
          <motion.div variants={card} className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-400/40 to-cyan-400/40 blur opacity-0 group-hover:opacity-100 transition" />
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-3">Disputes & communication</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Respond promptly and keep communication on-platform.</li>
                <li>Provide evidence and clear timelines if disputes arise.</li>
                <li>Follow protection guidelines to preserve seller coverage.</li>
              </ul>
            </div>
          </motion.div>

        </motion.section>
      </div>

      {/* === SELLER HUD === */}
      <div className="fixed bottom-6 right-6 text-xs text-amber-400 opacity-60 tracking-widest">
        SELLER MODE: ACTIVE
      </div>
    </div>
  );
}
