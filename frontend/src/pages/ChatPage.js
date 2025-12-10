import { useParams, useNavigate } from "react-router-dom";
import ChatInbox from "./ChatInbox";
import ChatRoom from "./ChatRoom";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 text-white relative">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b0f1a] via-black to-[#0b0f1a]" />
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_20%_15%,rgba(0,255,255,0.18),transparent_60%),radial-gradient(circle_at_80%_85%,rgba(180,0,255,0.2),transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-12 gap-4">
        {/* Sidebar: conversations */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 h-[calc(100vh-6rem)] overflow-auto rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(0,200,255,0.15)]">
          <div className="px-4 py-3 border-b border-white/10 sticky top-0 bg-black/30 backdrop-blur-xl z-10">
            <h2 className="text-sm font-semibold tracking-wide text-gray-200">Messages</h2>
          </div>
          <ChatInbox embedded onSelect={(id) => navigate(`/chat/${id}`)} activeChatId={chatId || null} />
        </aside>

        {/* Main: chat room */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9 h-[calc(100vh-6rem)] overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(160,0,255,0.15)]">
          {chatId ? (
            <ChatRoom />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300">
              Select a conversation from the left to start chatting.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
