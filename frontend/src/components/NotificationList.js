export default function NotificationList({ list, onMarkRead }) {
  if (!list || list.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-300">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((n) => (
        <div key={n._id} className={`p-4 rounded-2xl bg-white/5 border backdrop-blur-xl transition shadow-md hover:shadow-lg hover:bg-white/10 ${
            n.seen ? "border-white/10" : "border-cyan-400/40"
          }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <a href={n.link || "#"} className="block">
                <p className="text-sm md:text-base text-gray-100">{n.message}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </a>
            </div>
            <div className="flex items-center gap-2">
              {!n.seen && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-600 text-white whitespace-nowrap">
                  New
                </span>
              )}
              {!n.seen && onMarkRead && (
                <button
                  onClick={() => onMarkRead(n._id)}
                  className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
