import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  useEffect(() => {
    // handler to update when login/logout dispatches event
    const onUserIdChanged = () => setUserId(localStorage.getItem("userId"));
    window.addEventListener("userIdChanged", onUserIdChanged);

    return () => window.removeEventListener("userIdChanged", onUserIdChanged);
  }, []);

  useEffect(() => {
    if (!userId) return;

    // register user room
    socket.emit("registerUser", userId);

    // load notifications
    api.get("/notifications").then((res) => setList(res.data)).catch(() => {});

    // listen to real-time notification
    const handler = (data) => setList((prev) => [data, ...prev]);
    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [userId]);

  const unread = list.filter((n) => !n.seen).length;

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={async () => {
          const next = !open;
          setOpen(next);
          if (next && unread > 0) {
            try {
              await api.put("/notifications/read-all");
              setList((prev) => prev.map((n) => ({ ...n, seen: true })));
            } catch {}
          }
        }}
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white 
            text-xs px-1.5 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 glass-card p-4 max-h-96 overflow-y-auto z-50">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>

          {list.length === 0 && <p>No notifications</p>}

          {list.map((n) => (
            <Link
              key={n._id}
              to={n.link || "#"}
              className={`block p-2 rounded ${
                n.seen ? "opacity-70" : "bg-blue-600/20"
              }`}
            >
              <p>{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
