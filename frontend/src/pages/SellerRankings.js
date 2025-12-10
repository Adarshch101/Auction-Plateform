import { motion } from "framer-motion";

export default function SellerRankings() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 text-white">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Seller Rankings</motion.h1>
      <p className="text-gray-300 mb-8">See how top sellers rank by items sold, revenue, and auctions hosted.</p>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">Coming soon: public leaderboard with filters and time ranges.</div>
    </div>
  );
}
