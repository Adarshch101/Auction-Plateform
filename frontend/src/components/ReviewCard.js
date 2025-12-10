import RatingStars from "./RatingStars";
import { useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

export default function ReviewCard({ r }) {
  const [likes, setLikes] = useState(r.likes?.length || 0);
  const [dislikes, setDislikes] = useState(r.dislikes?.length || 0);
  const [busy, setBusy] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const like = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.put(`/reviews/like/${r._id}`);
      const updated = data?.review;
      if (updated) {
        setLikes(updated.likes?.length || 0);
        setDislikes(updated.dislikes?.length || 0);
        // Ideally we would check if current user id exists in updated.likes/updated.dislikes,
        // but we don't have it here; just infer by transition
        setLiked(updated.likes?.length > likes);
        setDisliked(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to like");
    } finally {
      setBusy(false);
    }
  };

  const dislike = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.put(`/reviews/dislike/${r._id}`);
      const updated = data?.review;
      if (updated) {
        setLikes(updated.likes?.length || 0);
        setDislikes(updated.dislikes?.length || 0);
        setDisliked(updated.dislikes?.length > dislikes);
        setLiked(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to dislike");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{r.buyerId?.name}</h3>
        <RatingStars value={Math.round(r.averageRating)} />
      </div>

      <p className="text-gray-300">{r.reviewText}</p>

      {r.images?.length > 0 && (
        <div className="flex gap-3">
          {r.images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-20 h-20 rounded object-cover border border-white/20"
            />
          ))}
        </div>
      )}

      <div className="flex gap-4 text-sm mt-4">
        <button onClick={like} disabled={busy} className={`flex items-center gap-1 disabled:opacity-60 ${liked ? "text-blue-300" : "text-blue-400"}`}>
          👍 {likes}
        </button>

        <button onClick={dislike} disabled={busy} className={`flex items-center gap-1 disabled:opacity-60 ${disliked ? "text-red-300" : "text-red-400"}`}>
          👎 {dislikes}
        </button>
      </div>

      <p className="text-xs opacity-50">
        {new Date(r.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
