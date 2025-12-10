import { motion } from "framer-motion";

export default function CosmicCurations() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 text-white">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Cosmic Curations</motion.h1>
      <p className="text-gray-300 mb-8">Editor-curated themes and stories tying antiques together in unexpected ways.</p>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">Coming soon: curated stories, thematic playlists, and featured sellers.</div>
    </div>
  );
}
