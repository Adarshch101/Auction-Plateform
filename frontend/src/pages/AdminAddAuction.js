import { useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import Modal from "../components/ui/Modal";

export default function AdminAddAuction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "general",
    startingPrice: "",
    startTime: "",
    endTime: "",
    status: "upcoming",
    featured: false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const dragRef = useState({ dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0 })[0];

  const categories = [
    "general",
    "antique",
    "vintage",
    "collectible",
    "jewelry",
    "furniture",
    "art",
    "books",
    "other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const applyCrop = async () => {
    try {
      if (!imageSrc) return setShowCropper(false);
      const img = new Image();
      img.src = imageSrc;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
      const ow = img.naturalWidth || img.width;
      const oh = img.naturalHeight || img.height;
      const size = Math.floor(Math.min(ow, oh) / zoom);
      let sx = Math.floor((ow - size) / 2 + (offsetX / zoom));
      let sy = Math.floor((oh - size) / 2 + (offsetY / zoom));
      sx = Math.max(0, Math.min(ow - size, sx));
      sy = Math.max(0, Math.min(oh - size, sy));
      const canvas = document.createElement("canvas");
      const outSize = 800;
      canvas.width = outSize;
      canvas.height = outSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx, sy, size, size, 0, 0, outSize, outSize);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setPreview(dataUrl);
      let blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) {
        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        blob = new Blob([ab], { type: mimeString });
      }
      const croppedFile = new File([blob], `cropped_${Date.now()}.jpg`, { type: "image/jpeg" });
      setFile(croppedFile);
    } catch {
    } finally {
      setShowCropper(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.title || !form.startingPrice || !form.startTime || !form.endTime) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate dates
      const startTime = new Date(form.startTime);
      const endTime = new Date(form.endTime);
      
      if (endTime <= startTime) {
        toast.error("End time must be after start time");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description || "");
      fd.append("category", form.category);
      fd.append("startingPrice", form.startingPrice);
      fd.append("startTime", form.startTime);
      fd.append("endTime", form.endTime);
      fd.append("status", form.status);
      fd.append("featured", form.featured ? "true" : "false");

      // If an image file was selected, send it; otherwise, if the form.image contains a URL, send that
      if (file) {
        fd.append("image", file);
      } else if (form.image) {
        fd.append("image", form.image);
      }

      await api.post("/auctions", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Auction created successfully!");
      setTimeout(() => navigate("/admin/auctions"), 1000);
    } catch (err) {
      console.error("Failed to create auction:", err);
      toast.error(err.response?.data?.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="pt-28 px-8 pb-20 max-w-4xl mx-auto text-white">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Create Auction
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6 shadow-lg">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter auction title"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter detailed description of the item"
            rows="4"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Starting Price */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Starting Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="startingPrice"
            value={form.startingPrice}
            onChange={handleChange}
            placeholder="Enter starting price"
            step="0.01"
            min="0"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
          />
          <label htmlFor="featured" className="text-sm">Mark as Featured</label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="h-48 w-auto rounded-lg object-cover" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-semibold text-white transition"
          >
            {loading ? "Creating..." : "Create Auction"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/auctions")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold text-white transition"
          >
            Cancel
          </button>
        </div>
      </form>

      <Modal open={showCropper} onClose={() => setShowCropper(false)}>
        <h3 className="text-2xl font-bold mb-4">Crop Image</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative bg-black/40 border border-white/10 rounded-xl p-3">
            <div
              className="relative w-[260px] h-[260px] overflow-hidden rounded-lg bg-black/30 touch-none"
              onPointerDown={(e) => {
                dragRef.dragging = true;
                dragRef.startX = e.clientX;
                dragRef.startY = e.clientY;
                dragRef.baseX = offsetX;
                dragRef.baseY = offsetY;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!dragRef.dragging) return;
                const dx = e.clientX - dragRef.startX;
                const dy = e.clientY - dragRef.startY;
                setOffsetX(dragRef.baseX + dx);
                setOffsetY(dragRef.baseY + dy);
              }}
              onPointerUp={(e) => {
                dragRef.dragging = false;
                try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
              }}
              onPointerLeave={() => { dragRef.dragging = false; }}
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="To crop"
                  className="absolute top-1/2 left-1/2 select-none"
                  style={{ transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${zoom})` }}
                  draggable={false}
                />
              )}
              <div className="pointer-events-none absolute inset-0 ring-2 ring-cyan-400/70 rounded-lg" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm mb-2">Zoom</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">Center square crop. Use zoom and drag to adjust area.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setShowCropper(false)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
          <button onClick={applyCrop} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Apply Crop</button>
        </div>
      </Modal>

      {/* Help Text */}
      <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required.
          Start time and end time must be set correctly for the auction to function properly.
        </p>
      </div>
      </div>
    </AdminLayout>
  );
}
