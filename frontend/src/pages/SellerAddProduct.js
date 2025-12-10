import { useState } from "react";
import { api } from "../utils/api";
import SellerLayout from "../components/seller/SellerLayout";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SellerAddProduct() {
  const categoryDefaults = ["antique", "vintage", "collectables"];

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    startingPrice: "",
    buyNowPrice: "",
    quantity: "",
    startTime: "",
    endTime: "",
    featured: false,
  });

  const [type, setType] = useState("auction");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  const updateCategory = (cat) => {
    const lower = cat.toLowerCase();
    setForm({ ...form, category: cat });
    if (categoryDefaults.includes(lower)) setType("auction");
    else setType("direct");
  };

  const updateImage = (e) => {
    const fs = Array.from(e.target.files || []);
    setFiles(fs);
    setPreviews(fs.map((f) => URL.createObjectURL(f)));
  };

  const submit = async () => {
    if (!form.title || !form.description) return toast.error("Title & description required");
    if (type === "auction" && !form.startingPrice) return toast.error("Starting price required");
    if (type === "direct" && !form.buyNowPrice) return toast.error("Price required");

    if (type === "direct") {
      const qty = Number(form.quantity || 0);
      if (!(qty > 0)) return toast.error("Quantity must be greater than 0");
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (files && files.length > 0) {
        // Preferred: send multiple images (backend must support upload.array('images'))
        files.forEach((f) => fd.append("images", f));
        // Also include first image for legacy servers
        fd.append("image", files[0]);
      }

      await api.post("/auctions", fd);

      toast.success("Product created successfully");

      setForm({
        title: "",
        description: "",
        category: "general",
        startingPrice: "",
        buyNowPrice: "",
        quantity: "",
        startTime: "",
        endTime: "",
        featured: false,
      });

      setFiles([]);
      setPreviews([]);
    } catch (err) {
      // Fallback: retry with only the first image under 'image' if server errors on multiple
      const status = err?.response?.status;
      if ((status === 500 || status === 400) && files && files.length > 1) {
        try {
          const fd2 = new FormData();
          Object.entries(form).forEach(([k, v]) => v && fd2.append(k, v));
          fd2.append("image", files[0]);
          await api.post("/auctions", fd2);
          toast.success("Product created with the first image (server doesn't support multiple images)");
          setForm({
            title: "",
            description: "",
            category: "general",
            startingPrice: "",
            buyNowPrice: "",
            quantity: "",
            startTime: "",
            endTime: "",
            featured: false,
          });
          setFiles([]);
          setPreviews([]);
          return;
        } catch (e2) {
          // Continue to generic error
        }
      }
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout>

      {/* 🌌 Aurora Background + Floating Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-16 left-16 w-72 h-72 bg-cyan-500 blur-[130px]" />
        <div className="absolute bottom-24 right-16 w-80 h-80 bg-purple-700 blur-[150px]" />

        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[5px] h-[5px] rounded-full bg-cyan-300 opacity-40"
            initial={{
              x: Math.random() * 1400,
              y: Math.random() * 900,
              opacity: 0,
            }}
            animate={{
              y: ["0%", "-160%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-10 text-white">

        {/* PAGE TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 
          bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]"
        >
          Add Product / Auction
        </motion.h1>

        {/* TYPE SWITCH BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-5 mt-6 mb-10"
        >
          {["auction", "direct"].map((t) => (
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              key={t}
              onClick={() => setType(t)}
              className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg
                ${
                  type === t
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/40 scale-105"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }
              `}
            >
              {t === "auction" ? "Auction Listing" : "Direct Sale"}
            </motion.button>
          ))}
        </motion.div>

        {/* FORM CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6"
        >
          {/* TITLE */}
          <FloatingInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* DESCRIPTION */}
          <FloatingTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* CATEGORY */}
          <FloatingInput
            label="Category"
            value={form.category}
            onChange={(e) => updateCategory(e.target.value)}
          />

          {/* CONDITIONALLY RENDER AUCTION / DIRECT SALE FIELDS */}
          {type === "auction" ? (
            <>
              <FloatingInput
                label="Starting Price"
                type="number"
                value={form.startingPrice}
                onChange={(e) =>
                  setForm({ ...form, startingPrice: e.target.value })
                }
              />

              <FloatingInput
                label="Start Time"
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />

              <FloatingInput
                label="End Time"
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </>
          ) : (
            <>
              <FloatingInput
                label="Buy Now Price"
                type="number"
                value={form.buyNowPrice}
                onChange={(e) =>
                  setForm({ ...form, buyNowPrice: e.target.value })
                }
              />

              <FloatingInput
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </>
          )}

          {/* IMAGE UPLOAD */}
          <div>
            <p className="text-gray-300 mb-2">Product Images</p>
            <motion.input
              whileHover={{ scale: 1.03 }}
              type="file"
              multiple
              accept="image/*"
              onChange={updateImage}
              className="text-gray-200"
            />
          </div>

          {/* FEATURED TOGGLE */}
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-gray-300">Mark as Featured</label>
          </div>

          {/* IMAGE PREVIEWS */}
          {previews && previews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg shadow-xl"
            >
              <p className="mb-3 text-gray-300">Previews:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {previews.map((src, idx) => (
                  <motion.img
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    src={src}
                    className="rounded-xl w-full h-40 object-cover shadow"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBMIT BUTTON */}
          <motion.button
            onClick={submit}
            disabled={saving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 
                       hover:brightness-110 font-semibold text-lg shadow-lg shadow-cyan-500/20 transition"
          >
            {saving ? "Saving..." : "Create Listing"}
          </motion.button>
        </motion.div>
      </div>
    </SellerLayout>
  );
}

/* ===========================
  Floating Input Components
=========================== */

function FloatingInput({ label, ...props }) {
  return (
    <motion.div className="relative">
      <input
        {...props}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none 
                   text-white focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,255,255,0.4)] backdrop-blur-lg transition"
      />
      <label className="absolute top-[-10px] left-3 text-xs bg-black/50 px-2 rounded text-cyan-300">
        {label}
      </label>
    </motion.div>
  );
}

function FloatingTextarea({ label, ...props }) {
  return (
    <motion.div className="relative">
      <textarea
        {...props}
        rows={4}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none 
                   text-white focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,255,255,0.4)] backdrop-blur-lg transition"
      />
      <label className="absolute top-[-10px] left-3 text-xs bg-black/50 px-2 rounded text-cyan-300">
        {label}
      </label>
    </motion.div>
  );
}
