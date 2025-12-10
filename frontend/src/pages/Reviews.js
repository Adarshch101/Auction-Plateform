import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";

export default function Reviews() {
  const { id } = useParams(); // auctionId
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get(`/reviews/${id}`).then((res) => setList(res.data));
  }, [id]);

  return (
    <div className="p-10 space-y-6 pt-20">
      <h1 className="text-3xl font-bold">Reviews</h1>

      {list.length === 0 && <p>No reviews yet</p>}

      <div className="space-y-6">
        {list.map((r) => (
          <ReviewCard key={r._id} r={r} />
        ))}
      </div>
    </div>
  );
}
