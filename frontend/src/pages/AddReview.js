import { useState } from "react";
import { api } from "../utils/api";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AddReview() {
  const { id } = useParams(); // auctionId
  const [form, setForm] = useState({
    accuracy: 5,
    quality: 5,
    communication: 5,
    reviewText: ""
  });
  const [images, setImages] = useState([]);

  const submit = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));

      await api.post(`/reviews/${id}`, fd);
      toast.success("Review submitted");
      window.location.href = `/auction/${id}`;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">Write a Review</h1>

      <div className="space-y-3">
        <label>Accuracy</label>
        <input
          type="number"
          min="1" max="5"
          className="bg-gray-800 p-2 w-full rounded"
          value={form.accuracy}
          onChange={(e) => setForm({ ...form, accuracy: e.target.value })}
        />

        <label>Quality</label>
        <input
          type="number"
          min="1" max="5"
          className="bg-gray-800 p-2 w-full rounded"
          value={form.quality}
          onChange={(e) => setForm({ ...form, quality: e.target.value })}
        />

        <label>Communication</label>
        <input
          type="number"
          min="1" max="5"
          className="bg-gray-800 p-2 w-full rounded"
          value={form.communication}
          onChange={(e) => setForm({ ...form, communication: e.target.value })}
        />

        <label>Review Text</label>
        <textarea
          className="bg-gray-800 p-3 w-full rounded"
          onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
        ></textarea>

        <label>Images (optional)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
        />
      </div>

      <button
        onClick={submit}
        className="w-full bg-green-600 py-3 rounded-xl"
      >
        Submit Review
      </button>
    </div>
  );
}
