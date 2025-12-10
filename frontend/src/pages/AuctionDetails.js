import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSettings } from "../context/SettingsContext";
import { useFormatCurrency } from "../utils/currency";

let socket;

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [related, setRelated] = useState([]);
  const [bids, setBids] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [shipTo, setShipTo] = useState("");
  const [insure, setInsure] = useState(false);
  const [shipQuote, setShipQuote] = useState(null);
  const driftRef = useRef(0);
  const { auth } = useContext(AuthContext);
  const { settings } = useSettings();
  const { format } = useFormatCurrency();
  const auctionCategories = new Set(["antique", "vintage", "collectables"]);
  const [spinIdx, setSpinIdx] = useState(0);

  // FETCH DATA
  useEffect(() => {
    fetchData();

    // Initialize socket and join auction room
    if (!socket) socket = io("http://localhost:4000");
    socket.emit("join", { room: `auction:${id}` });

    const onBidPlaced = (data) => {
      if (data?.auctionId === id || data?.id === id) {
        setAuction((prev) => prev ? { ...prev, currentPrice: data.amount } : prev);
        setBids((prev) => [{ amount: data.amount, userId: data.userId }, ...prev]);
      }
    };
    const onUpdateBidLegacy = (data) => {
      if (data?.id === id) {
        setAuction((prev) => prev ? { ...prev, currentPrice: data.amount } : prev);
        setBids((prev) => [{ amount: data.amount, userId: data.userId }, ...prev]);
      }
    };

    const onAuctionEnded = (data) => {
      if (data?.auctionId === id || data?.id === id) {
        toast("Auction has ended");
        setAuction((prev) => prev ? { ...prev, status: "ended" } : prev);
      }
    };

    socket.on("bidPlaced", onBidPlaced);
    socket.on("updateBid", onUpdateBidLegacy);
    socket.on("auctionEnded", onAuctionEnded);

    return () => {
      socket.emit("leave", { room: `auction:${id}` });
      socket.off("bidPlaced", onBidPlaced);
      socket.off("updateBid", onUpdateBidLegacy);
      socket.off("auctionEnded", onAuctionEnded);
    };
  }, [id]);

  const fetchData = async () => {
    const res = await api.get(`/auctions/${id}`);
    setAuction(res.data);
    setSpinIdx(0);
    // Compute drift using server date header if available
    try {
      const serverDate = res?.headers?.date ? new Date(res.headers.date).getTime() : null;
      if (serverDate) {
        driftRef.current = serverDate - Date.now();
      }
    } catch {}

    // Fetch bids separately
    try {
      const bidsRes = await api.get(`/bids/${id}`);
      setBids(bidsRes.data || []);
    } catch (err) {
      console.error("Failed to fetch bids", err);
      setBids([]);
    }

    // Fetch personal bids when logged in
    try {
      if (auth?.token) {
        const myBidsRes = await api.get(`/bids/${id}/me`);
        setMyBids(myBidsRes.data || []);
      } else {
        setMyBids([]);
      }
    } catch (err) {
      setMyBids([]);
    }

    const relatedRes = await api.get(`/auctions`, { params: { category: res.data.category } });
    const relData = relatedRes.data.items || relatedRes.data; // support new pagination
    setRelated((relData || []).slice(0, 3));

    startTimer(res.data.endTime);

    // Initialize wishlist state
    try {
      if (auth?.token) {
        const wl = await api.get(`/wishlist`);
        const list = wl.data || [];
        const present = Array.isArray(list) ? list.some((x) => (x._id || x.auctionId?._id) === id) : false;
        setInWishlist(present);
      } else {
        setInWishlist(false);
      }
    } catch {
      setInWishlist(false);
    }
  };

  // TIMER
  const startTimer = (endTime) => {
    const interval = setInterval(() => {
      const now = new Date(Date.now() + (driftRef.current || 0));
      const end = new Date(endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
  };

  // PLACE BID
  const placeBid = async () => {
    try {
      if (bid <= auction.currentPrice) {
        toast.error("Bid must be higher than current price");
        return;
      }
      // client-side enforcement of bid increment if configured
      const inc = Number(settings?.bidIncrement || 0);
      if (inc > 0) {
        const required = Number(auction.currentPrice) + inc;
        if (Number(bid) < required) {
          toast.error(`Minimum next bid is ₹${required} (increment ₹${inc})`);
          return;
        }
      }
      const amount = Number(bid);
      // Optimistic update
      const prevPrice = auction.currentPrice;
      const prevBids = bids;
      setAuction((prev) => ({ ...prev, currentPrice: amount }));
      setBids((prev) => [{ amount, userId: auth?.userId }, ...prev]);

      await api.post(`/bids/${id}`, { amount });
      socket && socket.emit("newBid", { id, amount });
      setBid("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to place bid";
      toast.error(msg);
      // Rollback optimistic update
      fetchData();
    }
  };

  // WATCHLIST TOGGLE
  async function toggleWishlist() {
    try {
      if (!auth?.token) return navigate("/login");
      if (inWishlist) {
        await api.delete(`/wishlist/${id}`);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await api.post(`/wishlist`, { auctionId: id });
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update wishlist");
    }
  }

  // BUY NOW
  const buyNow = async () => {
    navigate(`/payment/${id}`);
  };

  // START CHAT WITH SELLER
  const startChat = async () => {
    try {
      if (!auth?.token) return navigate("/login");
      const rawSeller = auction?.seller ?? auction?.sellerId;
      const sellerId = typeof rawSeller === "string" ? rawSeller : rawSeller?._id;
      const payload = { auctionId: auction?._id || id };
      if (sellerId) payload.sellerId = sellerId;
      const res = await api.post("/chat/start", payload);
      const chatId = res?.data?._id;
      // Navigate to full-page chat room
      if (chatId) navigate(`/chat/${chatId}`);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to start chat";
      toast.error(msg);
    }
  };

  if (!auction) return <p className="text-white p-10">Loading...</p>;

  const isAuction = auctionCategories.has((auction.category || "").toLowerCase());
  const relatedPrices = (related || []).map((r) => Number(r.currentPrice || 0)).filter((n) => n > 0);
  let fairLow = null, fairHigh = null;
  if (relatedPrices.length >= 3) {
    const sorted = [...relatedPrices].sort((a,b)=>a-b);
    const mid = sorted[Math.floor(sorted.length/2)];
    fairLow = Math.round(mid * 0.85);
    fairHigh = Math.round(mid * 1.15);
  }

  function estimateShipping() {
    const base = 120;
    const zone = shipTo && /\d{6}/.test(shipTo) ? 1 : 2;
    const weightKg = Number(auction?.weightKg || 2);
    const perKg = zone === 1 ? 60 : 90;
    let cost = base + perKg * Math.ceil(weightKg);
    if (insure) cost += Math.ceil((Number(auction?.currentPrice || 0)) * 0.01);
    setShipQuote({ cost, eta: zone === 1 ? "2-4 days" : "4-7 days" });
  }

  return (
    <div className="relative pt-24 px-6 max-w-7xl mx-auto text-white overflow-hidden">

      {/* CYBERPUNK BACKGROUND */}
      <div className="absolute inset-0  bg-[url('https://th.bing.com/th/id/OIP.tgh660d6GOZAiPP6clX9-QHaEK?w=327&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1')]
                      bg-cover bg-center opacity-[0.12] mix-blend-screen pointer-events-none" />

      {/* ARCANE FOG */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(170,60,255,0.4),transparent_70%),
                                        radial-gradient(circle_at_80%_80%,rgba(0,200,255,0.45),transparent_70%)] opacity-40" />

      {/* CYBER RAIN */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[80px] bg-cyan-300/20 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "1800px" }}
          transition={{ repeat: Infinity, duration: Math.random() * 1 + 0.6 }}
        />
      ))}

      {/* ARCANE SPELL CIRCLE */}
      <motion.img
        src="https://th.bing.com/th/id/OIP.vI0cUZocC3Q7l9c8HKoWjwHaJR?w=146&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] opacity-[0.1] pointer-events-none select-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-5xl font-extrabold drop-shadow-[0_0_15px_rgba(0,200,255,0.5)]"
      >
        {auction.title}
      </motion.h1>

      <p className="relative z-10 text-purple-300 mt-1 tracking-wider text-sm">
        {auction.category}
      </p>

      {/* MAIN GRID */}
      <div className="relative z-10 mt-10 grid lg:grid-cols-2 gap-10">

        {/* IMAGE + STATUS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-purple-500/20 
                     shadow-[0_0_35px_rgba(150,0,255,0.25)] relative overflow-hidden"
        >
          {/* Hologram overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/10 pointer-events-none" />

          {(() => {
            const imgs = Array.isArray(auction.images) && auction.images.length > 0 ? auction.images : [auction.image];
            const current = imgs[Math.min(spinIdx, imgs.length - 1)];
            return (
              <div>
                <img
                  src={current}
                  className="rounded-2xl shadow-[0_0_25px_rgba(0,200,255,0.25)] w-full"
                  alt={auction.title}
                />
                {imgs.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {imgs.map((u, i) => (
                      <button key={i} onClick={() => setSpinIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border ${i===spinIdx?"border-cyan-400":"border-white/10"}`}>
                        <img src={u} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <div className="mt-4 flex justify-between items-center">
            <span className={`px-4 py-1 rounded-full text-sm 
              ${auction.status === "active" ? "bg-green-500/30 text-green-300" : "bg-red-500/30 text-red-300"}`}>
              {auction.status.toUpperCase()}
            </span>

            <span className="text-lg text-cyan-300 font-semibold">
              {timeLeft === "Ended" ? "Auction Ended" : `Ends in: ${timeLeft}`}
            </span>
          </div>

          {/* Watchlist */}
          {auth?.token && (
            <button
              onClick={toggleWishlist}
              className={`mt-4 px-4 py-2 rounded-lg border ${inWishlist ? "bg-pink-600/60 border-pink-400" : "bg-white/10 border-white/20"}`}
            >
              {inWishlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>
          )}

          {/* REVIEWS LINKS */}
          <div className="mt-8 flex items-center gap-4">
            <Link
              to={`/reviews/${id}`}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              View Reviews
            </Link>
            <Link
              to={`/reviews/add/${id}`}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 transition"
            >
              Write a Review
            </Link>
          </div>
        </motion.div>

        {/* DETAILS PANEL */}
        <motion.div
          initial={{ x: 35, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl 
                     border border-purple-500/20 shadow-[0_0_35px_rgba(170,0,255,0.2)] space-y-6"
        >
          <h2 className="text-3xl font-bold">
            {isAuction ? "Highest Bid" : "Price"}: <span className="text-cyan-400">{format(auction.currentPrice)}</span>
          </h2>
          {!isAuction && fairLow && fairHigh && (
            <p className="text-sm text-emerald-300">Fair price range: {format(fairLow)} – {format(fairHigh)}</p>
          )}
          {!isAuction && (
            <p className="text-sm text-gray-300">Stock: {typeof auction.quantity === 'number' ? auction.quantity : 0}</p>
          )}

          <p className="text-gray-300">{auction.description}</p>

          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Destination (PIN or Country)</label>
                <input value={shipTo} onChange={(e)=>setShipTo(e.target.value)} placeholder="e.g., 560001 or USA" className="w-full bg-black/30 p-3 rounded-xl border border-white/10" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={insure} onChange={(e)=>setInsure(e.target.checked)} />
                Add insurance (~1%)
              </label>
              <button onClick={estimateShipping} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20">Estimate Shipping</button>
            </div>
            {shipQuote && (
              <div className="mt-3 text-sm text-gray-200">
                <span className="mr-4">Estimated cost: <span className="text-cyan-300 font-semibold">{format(shipQuote.cost)}</span></span>
                <span>ETA: <span className="text-gray-300">{shipQuote.eta}</span></span>
              </div>
            )}
          </div>

          {/* BUY NOW (only for non-auction categories) */}
          {!isAuction && auction.buyNowPrice && auction.status === "active" && (
            auction.quantity > 0 ? (
              <button
                onClick={buyNow}
                className="w-full py-3 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-pink-500
                           shadow-[0_0_25px_rgba(200,0,255,0.4)] hover:brightness-110 transition"
              >
                Buy Now for {format(auction.buyNowPrice)}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 text-lg rounded-xl bg-gray-700 cursor-not-allowed opacity-70"
              >
                Out of stock
              </button>
            )
          )}

          {/* BID INPUT (only for auction categories) */}
          {isAuction && auth.token && auction.status === "active" && (
            <div className="mt-6 flex gap-3">
              <input
                type="number"
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                placeholder="Enter your bid"
                className="flex-grow bg-black/30 p-3 rounded-xl border border-purple-500/20 
                           text-purple-200 shadow-[0_0_15px_rgba(150,0,255,0.15)] outline-none focus:border-cyan-400"
              />
              <button
                onClick={placeBid}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600
                           shadow-[0_0_25px_rgba(0,200,255,0.4)] hover:brightness-110 transition"
              >
                Place Bid
              </button>
            </div>
          )}
          {isAuction && settings?.bidIncrement ? (
            <p className="text-xs text-gray-400 mt-2">
              Minimum increment: ₹{settings.bidIncrement}. Next bid should be at least ₹{Number(auction.currentPrice) + Number(settings.bidIncrement)}.
            </p>
          ) : null}

          {/* BID HISTORY */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-purple-200">Bid History</h3>

            {bids.length === 0 && (
              <p className="text-gray-400 mt-2">No bids yet.</p>
            )}

            <div className="space-y-2 max-h-56 overflow-y-auto pr-2 mt-3">
              {bids.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 p-3 rounded-lg border border-white/10 text-gray-200 
                             shadow-[0_0_15px_rgba(180,0,255,0.2)]"
                >
                  {format(b.amount)}
                </motion.div>
              ))}
            </div>
          </div>

          {/* YOUR BIDS */}
          {auth?.token && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-purple-200">Your Bids</h3>
              {myBids.length === 0 && (
                <p className="text-gray-400 mt-2">You have not placed any bids yet.</p>
              )}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2 mt-3">
                {myBids.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 p-3 rounded-lg border border-white/10 text-gray-200 
                               shadow-[0_0_15px_rgba(180,0,255,0.2)]"
                  >
                    {format(b.amount)}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SELLER INFO */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-purple-200">Seller</h3>

            <div className="flex items-center gap-4 mt-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 
                              flex items-center justify-center font-bold text-xl">
                {(auction.seller?.name || auction.sellerId?.name || "S").slice(0,1)}
              </div>

              <div>
                <p className="font-semibold flex items-center gap-2">
                  {auction.seller?.name || auction.sellerId?.name}
                  {(auction.seller?.kycVerified || auction.sellerId?.kycVerified) && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-600/30 border border-emerald-400/40 text-emerald-200">Verified</span>
                  )}
                </p>
                <p className="text-gray-400">{auction.seller?.email || auction.sellerId?.email}</p>
              </div>
            </div>

            {auth?.token && (() => {
              const rawSeller = auction?.seller ?? auction?.sellerId;
              const sellerId = typeof rawSeller === "string" ? rawSeller : rawSeller?._id;
              const myId = auth?.userId || localStorage.getItem("userId");
              const isMine = sellerId && myId && sellerId === myId;
              return !isMine;
            })() && (
              <button
                onClick={startChat}
                className="mt-4 w-full py-3 text-lg rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Chat with Seller
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* RELATED AUCTIONS */}
      <div className="relative z-10 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-purple-200">You May Also Like</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {related.map((r) => (
            <motion.div
              key={r._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/5 p-5 rounded-xl border border-purple-500/20 
                         shadow-[0_0_25px_rgba(160,0,255,0.25)] hover:bg-white/10 transition"
            >
              <img src={r.image} className="rounded-xl h-40 w-full object-cover" />
              <h3 className="text-lg font-bold mt-3">{r.title}</h3>
              <p className="text-cyan-300">{format(r.currentPrice)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
