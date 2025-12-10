import { motion } from "framer-motion";

export default function HowSellerWorks() {
  const steps = [
    {
      title: "Apply or Upgrade to Seller",
      desc: "Create an account and upgrade to a seller from the Seller Join page. Complete your profile and verification if required.",
    },
    {
      title: "Create an Auction",
      desc: "Use the Seller Dashboard to create a new auction. Add title, description, images, start/end times, and starting price.",
    },
    {
      title: "Go Live and Receive Bids",
      desc: "When the auction is live, bidders compete in real time. You’ll receive notifications for new bids and watchlist engagement.",
    },
    {
      title: "Auction Ends and Winner is Determined",
      desc: "When the timer ends, the highest valid bid wins. An order is generated and both seller and buyer are notified.",
    },
    {
      title: "Fulfill the Order",
      desc: "Pack your item and ship to the buyer’s address. Update order status and add tracking if available.",
    },
    {
      title: "Get Paid",
      desc: "After successful delivery or platform settlement rules, funds are released to your wallet. Withdraw to your bank as per policy.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 text-white">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text"
      >
        How Selling Works
      </motion.h1>
      <p className="text-gray-300 mb-10 max-w-3xl">
        Learn the end-to-end journey of selling antiques on AntiqueXX. From creating your first auction to getting paid—these are the key steps.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold">{i + 1}</span>
              <h2 className="text-xl font-semibold">{s.title}</h2>
            </div>
            <p className="text-gray-300">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-200">
        Tip: Great photos and clear descriptions significantly improve bidding activity and final prices.
      </div>
    </div>
  );
}
