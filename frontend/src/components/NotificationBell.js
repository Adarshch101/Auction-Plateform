import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [tab, setTab] = useState("all"); // all | bids | wins | messages

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
    api.get("/notifications").then((res) => setList(res.data || [])).catch(() => {});

    // listen to real-time notification
    const handler = (data) => setList((prev) => [data, ...prev]);
    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [userId]);

  const unread = list.filter((n) => !n.seen).length;

  function getType(n) {
    if (n.type) return n.type; // server provided
    const msg = String(n.message || "").toLowerCase();
    if (msg.includes("outbid") || msg.includes("bid")) return "bids";
    if (msg.includes("won") || msg.includes("win")) return "wins";
    if (msg.includes("message") || msg.includes("chat")) return "messages";
    return "other";
  }

  const filtered = tab === "all" ? list : list.filter((n) => getType(n) === tab);

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile slide-over */}
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-[#0b1020] border-l border-white/10 p-4">
              <PanelContent {...{ list, filtered, tab, setTab, unread, setList, setOpen }} />
            </div>
          </div>

          {/* Desktop dropdown */}
          <div className="hidden md:block absolute right-0 mt-3 w-80 glass-card p-0 max-h-96 overflow-hidden z-50 border border-white/10 rounded-xl">
            <PanelContent {...{ list, filtered, tab, setTab, unread, setList, setOpen }} />
          </div>
        </>
      )}
    </div>
  );
}

function PanelContent({ list, filtered, tab, setTab, unread, setList, setOpen }) {
  async function markAll() {
    try {
      await api.put("/notifications/read-all");
      setList((prev) => prev.map((n) => ({ ...n, seen: true })));
    } catch {}
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAll}
            disabled={unread === 0}
            className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20 disabled:opacity-50"
          >
            Mark all read
          </button>
          <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs text-cyan-300 underline">
            View all
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs mb-3">
        {[
          { k: "all", t: "All" },
          { k: "bids", t: "Bids" },
          { k: "wins", t: "Wins" },
          { k: "messages", t: "Messages" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTab(x.k)}
            className={`px-2 py-1 rounded border ${tab === x.k ? "bg-cyan-600/30 border-cyan-400/40" : "bg-white/5 border-white/10"}`}
          >
            {x.t}
          </button>
        ))}
      </div>

      <div className="max-h-72 overflow-y-auto pr-1">
        {list.length === 0 ? (
          <p className="text-sm text-gray-400">No notifications</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400">No items in this category</p>
        ) : (
          filtered.map((n) => (
            <Link
              key={n._id}
              to={n.link || "#"}
              onClick={() => setOpen(false)}
              className={`block p-2 rounded mb-1 ${n.seen ? "opacity-70" : "bg-blue-600/20"}`}
            >
              <p>{n.message}</p>
              <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
