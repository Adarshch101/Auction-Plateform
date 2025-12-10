import { useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import UserAvatar from "../components/UserAvatar";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

/* ======================================================
   🔮 FULLSCREEN ROTATING ARTIFACT (GODMODE BACKGROUND)
====================================================== */
function FullscreenArtifact() {
  return (
    <motion.img
      src="https://th.bing.com/th/id/OIP.WCMDcv8B0Q56Lr2QZiR-EAHaEK?w=271&h=180"
      className="fixed inset-0 w-full h-full object-contain opacity-[0.10] pointer-events-none select-none"
      style={{
        zIndex: 0,
        filter: "drop-shadow(0 0 40px rgba(160,0,255,0.4))",
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 50,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

/* ======================================================
   ⭐ CHAT INBOX PAGE
====================================================== */
export default function ChatInbox({ onSelect, embedded = false }) {
  const [chats, setChats] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    api.get("/chat").then((res) => setChats(res.data));
  }, []);

  const Container = ({ children }) => (
    embedded || onSelect ? (
      <div className="p-3">{children}</div>
    ) : (
      <div className="relative min-h-screen overflow-hidden pt-20 px-6">
        <FullscreenArtifact />
        <div className="relative z-10 max-w-4xl mx-auto">{children}</div>
      </div>
    )
  );

  return (
    <Container>
      {!(embedded || onSelect) && (
        <h1 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(150,0,255,0.7)]">Messages</h1>
      )}

      {chats.length === 0 && (
        <p className="text-gray-400">No conversations yet.</p>
      )}

      <div className="space-y-4">
          {chats.map((chat) => {
            const myId = auth?.userId || localStorage.getItem("userId");
            const otherUser = chat.users.find((u) => u._id !== myId);

            if (onSelect) {
              return (
                <div
                  key={chat._id}
                  onClick={() => onSelect(chat._id)}
                  className="cursor-pointer flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition shadow-lg hover:shadow-purple-500/20"
                >
                  <UserAvatar name={otherUser?.name} />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-200 flex items-center gap-2">
                      {otherUser?.name}
                      {otherUser?.kycVerified && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-600/30 border border-emerald-400/40 text-emerald-200">Verified</span>
                      )}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-1">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  {chat.auctionId && (
                    <div className="hidden md:flex items-center gap-2 mr-3">
                      <img
                        src={chat.auctionId.image}
                        className="w-10 h-10 rounded object-cover border border-white/20"
                      />
                      <span className="text-xs text-gray-300 max-w-[150px] line-clamp-1">
                        {chat.auctionId.title}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col items-end gap-2 min-w-[56px]">
                    <PresenceDot userId={otherUser?._id} />

                    {chat.unread > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-600 text-white shadow">
                        {chat.unread}
                      </span>
                    )}

                    <p className="text-[10px] text-gray-400">
                      {chat.lastMessageAt
                        ? new Date(chat.lastMessageAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <Link
                to={`/chat/${chat._id}`}
                key={chat._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-lg 
                         border border-white/20 hover:bg-white/20 transition shadow-lg hover:shadow-purple-500/20"
              >
                <UserAvatar name={otherUser?.name} />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-200 flex items-center gap-2">
                    {otherUser?.name}
                    {otherUser?.kycVerified && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-600/30 border border-emerald-400/40 text-emerald-200">Verified</span>
                    )}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-1">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>

                {chat.auctionId && (
                  <div className="hidden md:flex items-center gap-2 mr-3">
                    <img
                      src={chat.auctionId.image}
                      className="w-10 h-10 rounded object-cover border border-white/20"
                    />
                    <span className="text-xs text-gray-300 max-w-[150px] line-clamp-1">
                      {chat.auctionId.title}
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-end gap-2 min-w-[56px]">
                  <PresenceDot userId={otherUser?._id} />

                  {chat.unread > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-600 text-white shadow">
                      {chat.unread}
                    </span>
                  )}

                  <p className="text-[10px] text-gray-400">
                    {chat.lastMessageAt
                      ? new Date(chat.lastMessageAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </Container>
  );
}

/* ======================================================
   ⭐ ONLINE STATUS DOT
====================================================== */
function PresenceDot({ userId }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!userId) return;

    api.get(`/chat/presence/${userId}`).then((res) => {
      if (mounted) setOnline(!!res.data?.online);
    });

    const t = setInterval(() => {
      api.get(`/chat/presence/${userId}`).then((res) => {
        if (mounted) setOnline(!!res.data?.online);
      });
    }, 8000);

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [userId]);

  return (
    <span
      className={`w-2.5 h-2.5 rounded-full ${
        online ? "bg-green-400" : "bg-gray-600"
      }`}
    />
  );
}
