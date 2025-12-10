import { motion } from "framer-motion";

export default function ShippingPolicies() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14 text-white">
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Shipping Policies</motion.h1>
      <p className="text-gray-300 mb-6">Guidelines on packaging, handling, timelines, and responsibilities for shipping auctioned items.</p>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Packaging & Handling</h2>
          <p className="text-gray-300">Ensure adequate protection for fragile antiques. Include cushioning and waterproof layers where applicable.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Dispatch Timelines</h2>
          <p className="text-gray-300">Sellers should dispatch within 2-4 business days after order confirmation unless otherwise communicated.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Tracking & Proof</h2>
          <p className="text-gray-300">Provide tracking details when available. Keep shipment receipts until delivery is confirmed.</p>
        </div>
      </div>
    </div>
  );
}
