import { motion } from "framer-motion";

export default function CommissionInfo() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14 text-white">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Commission Information</motion.h1>
      <p className="text-gray-300 mb-6">Understand seller commissions, fees, and settlement timelines on AntiqueXX.</p>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Standard Commission</h2>
          <p className="text-gray-300">A platform fee is applied to the final sale price. Rates may vary based on category and promotions.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Payment Settlement</h2>
          <p className="text-gray-300">Payouts post-delivery confirmation or per platform policy to your wallet; withdraw anytime to your bank.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Promotional Rates</h2>
          <p className="text-gray-300">Occasional discounts apply during campaigns. Stay tuned for announcements.</p>
        </div>
      </div>
    </div>
  );
}
