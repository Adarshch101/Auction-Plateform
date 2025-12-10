import { motion } from "framer-motion";

export default function IntergalacticArtifacts() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 text-white">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Intergalactic Artifacts</motion.h1>
      <p className="text-gray-300 mb-8">Exotic finds and rare artifacts from across cultures and centuries. Discover standout pieces and stories behind them.</p>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">Coming soon: artifact spotlight, provenance timelines, and expert notes.</div>
    </div>
  );
}
