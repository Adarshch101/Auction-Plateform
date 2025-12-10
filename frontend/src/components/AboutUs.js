import { motion } from "framer-motion";
import { useState } from "react";

/* ============================================================
   FULLSCREEN ROTATING ARTIFACT (ONLY ONE)
============================================================ */
function FullscreenArtifact() {
  return (
    <motion.img
      src="https://th.bing.com/th/id/OIP.oGYPdPIFbaMAc7nx7iC5KQHaE8?w=292&h=195&c=7&r=0&o=7&pid=1.7"
      className="fixed inset-0 w-full h-full object-contain opacity-[0.12] pointer-events-none select-none"
      style={{
        zIndex: 0,
        filter: "drop-shadow(0 0 45px rgba(150,0,255,0.3))",
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

/* ============================================================
   MAIN PAGE
============================================================ */
export default function AboutUs() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-white relative overflow-hidden">

      {/* SINGLE GLOBAL ROTATING ARTIFACT */}
      <FullscreenArtifact />

      {/* GLOBAL AURORA BACKLIGHT */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-[1]">
        <div className="absolute top-10 left-16 w-[500px] h-[500px] bg-blue-600 blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-700 blur-[160px]" />
      </div>

      {/* ============================================================
         HEADER / HERO
      ============================================================= */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 
                   text-transparent bg-clip-text drop-shadow-2xl mb-8 relative z-[2]"
      >
        About AntiqueXX
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-300 leading-relaxed relative z-[2] max-w-3xl"
      >
        AntiqueXX is India’s first AI-powered antique marketplace merging
        <span className="text-purple-300 font-semibold"> ancient heritage</span> with  
        <span className="text-blue-300 font-semibold"> futuristic auction technology.</span>
        We are building the next generation of digital treasure hunting.
      </motion.p>

      {/* ============================================================
         VISION & MISSION SECTION
      ============================================================= */}
      <section className="mt-20 relative z-[2]">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text">
          Vision & Mission
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard
            title="Our Vision"
            desc="To become the world’s largest digital hub for antique and rare collectibles."
          />
          <GlassCard
            title="Our Mission"
            desc="Empower collectors with transparent auctions, AI-backed authenticity, and global accessibility."
          />
        </div>
      </section>

      {/* ============================================================
         WHY CHOOSE US
      ============================================================= */}
      <section className="mt-24 relative z-[2]">
        <h2 className="text-4xl font-bold mb-6">✨ Why Choose Us?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <USPCard title="AI-Powered Auctions" desc="Smart pricing, anti-fraud detection & real-time bidding." />
          <USPCard title="Secure Transactions" desc="Encrypted payments & safe-wallet system." />
          <USPCard title="Collector Community" desc="Join thousands of antique lovers & premium sellers." />
        </div>
      </section>

      {/* ============================================================
         PARALLAX ARTIFACT IMAGE
      ============================================================= */}
      {/* <section className="mt-28 relative z-[2]">
        <div
          className="h-[350px] w-full rounded-3xl bg-cover bg-center shadow-2xl"
          style={{
            backgroundImage:
              "url('https://i.ibb.co/vQW12Xt/ancient-tablet.jpg')",
          }}
        />
        <p className="text-center mt-6 text-gray-300">
          Ancient artifacts meet futuristic bidding.
        </p>
      </section> */}

      {/* ============================================================
         TIMELINE
      ============================================================= */}
      <section className="mt-24 relative z-[2]">
        <h2 className="text-4xl font-bold mb-10">📜 Our Journey</h2>

        <div className="space-y-10 border-l border-purple-500/30 pl-8">
          <TimelineItem year="2020" text="The idea of AntiqueXX was born to preserve India’s rare artifacts." />
          <TimelineItem year="2021" text="Launched prototype with 500+ collectors onboard." />
          <TimelineItem year="2022" text="Introduced AI authentication & live cyber auctions." />
          <TimelineItem year="2023" text="Expanded to global sellers and rare artifact curators." />
          <TimelineItem year="2024" text="Reached 2M+ bids and 100K successful auctions." />
        </div>
      </section>

      {/* ============================================================
         TEAM SECTION
      ============================================================= */}
      <section className="mt-28 relative z-[2]">
        <h2 className="text-4xl font-bold mb-12">👑 Meet the Team</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <TeamCard
            name="Adarsh Kumar"
            role="Founder / CEO"
            img="https://i.ibb.co/0VJvWpr/profile1.jpg"
          />
          <TeamCard
            name="Riya Sharma"
            role="CTO / AI Architect"
            img="https://i.ibb.co/0VJvWpr/profile1.jpg"
          />
          <TeamCard
            name="Arjun Verma"
            role="Marketplace Director"
            img="https://i.ibb.co/0VJvWpr/profile1.jpg"
          />
        </div>
      </section>

      {/* ============================================================
         FAQ SECTION
      ============================================================= */}
      <section className="mt-28 relative z-[2]">
        <h2 className="text-4xl font-bold mb-10">❓ Frequently Asked Questions</h2>

        <Accordion
          q="How do I join AntiqueXX?"
          a="Simply register, verify your email, and explore auctions instantly."
        />

        <Accordion
          q="How do I place a bid?"
          a="Select any active auction, enter your bid amount, and confirm. Real-time updates show instantly."
        />

        <Accordion
          q="How do I win?"
          a="If your bid is the highest when the timer ends, you win automatically."
        />

        <Accordion
          q="Is bidding safe?"
          a="Yes! We use encrypted transactions, AI monitoring, and fraud detection."
        />
      </section>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */
function GlassCard({ title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
    >
      <h3 className="text-2xl font-semibold text-blue-300">{title}</h3>
      <p className="text-gray-300 mt-2">{desc}</p>
    </motion.div>
  );
}

function USPCard({ title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-white/5 border border-purple-500/20 shadow-lg backdrop-blur-lg hover:bg-white/10 transition"
    >
      <h3 className="text-xl font-semibold text-purple-300">{title}</h3>
      <p className="text-gray-300 mt-2">{desc}</p>
    </motion.div>
  );
}

function TimelineItem({ year, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="absolute -left-4 top-2 w-3 h-3 bg-purple-400 rounded-full shadow-md"></div>
      <h4 className="text-xl font-semibold text-purple-300">{year}</h4>
      <p className="text-gray-300">{text}</p>
    </motion.div>
  );
}

function TeamCard({ name, role, img }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-xl"
    >
      <img
        src={img}
        className="w-32 h-32 rounded-full mx-auto border border-purple-400 shadow-xl object-cover"
      />
      <h3 className="text-xl font-semibold text-purple-300 mt-4">{name}</h3>
      <p className="text-gray-400">{role}</p>
    </motion.div>
  );
}

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl text-left font-semibold"
      >
        {q}
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 text-gray-300"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}
