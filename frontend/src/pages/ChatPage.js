import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ChatInbox from "./ChatInbox";
import ChatRoom from "./ChatRoom";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen pt-16 text-white relative">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b0f1a] via-black to-[#0b0f1a]" />
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_20%_15%,rgba(0,255,255,0.18),transparent_60%),radial-gradient(circle_at_80%_85%,rgba(180,0,255,0.2),transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-12 gap-4">
        {/* Sidebar: conversations (visible as column on md+, drawer on mobile) */}
        <aside className="hidden md:block col-span-12 md:col-span-4 lg:col-span-3 h-[calc(100vh-6rem)] overflow-auto no-scrollbar rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(0,200,255,0.15)]">
          <div className="px-4 py-3 border-b border-white/10 sticky top-0 bg-black/30 backdrop-blur-xl z-10">
            <h2 className="text-sm font-semibold tracking-wide text-gray-200">Messages</h2>
          </div>
          <ChatInbox embedded onSelect={(id) => { setSidebarOpen(false); navigate(`/chat/${id}`); }} activeChatId={chatId || null} />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-10/12 max-w-sm bg-white/5 border-r border-white/10 backdrop-blur-xl shadow-2xl overflow-auto no-scrollbar">
              <div className="px-4 py-3 border-b border-white/10 sticky top-0 bg-black/30 backdrop-blur-xl z-10 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-gray-200">Messages</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-xs text-gray-300 px-2 py-1 rounded bg-white/10 border border-white/20">Close</button>
              </div>
              <ChatInbox embedded onSelect={(id) => { setSidebarOpen(false); navigate(`/chat/${id}`); }} activeChatId={chatId || null} />
            </div>
          </div>
        )}

        {/* Main: chat room */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9 h-[calc(100vh-6rem)] overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(160,0,255,0.15)] flex flex-col min-h-0">
          {/* Mobile header with toggle */}
          <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/30">
            <button onClick={() => setSidebarOpen(true)} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm">Chats</button>
            <div className="text-sm text-gray-300">{chatId ? 'Conversation' : 'Select a conversation'}</div>
            <div className="w-[68px]" />
          </div>

          <div className="flex-1 min-h-0">
            {chatId ? (
              <ChatRoom />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300">
                Select a conversation from the left to start chatting.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
