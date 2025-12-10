import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiChevronDown, FiChevronUp, FiMessageSquare } from "react-icons/fi";
import ChatInbox from "../pages/ChatInbox";
import ChatRoom from "../pages/ChatRoom";

export default function ChatDropdown() {
  const { auth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    const onOpen = (e) => {
      const id = e?.detail?.chatId || null;
      setSelectedChatId(id);
      setOpen(true);
    };
    window.addEventListener("chat:open", onOpen);
    return () => window.removeEventListener("chat:open", onOpen);
  }, []);

  if (!auth?.token) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        aria-label="Toggle chat"
        onClick={() => setOpen((s) => !s)}
        className="fixed z-40 right-4 bottom-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition"
      >
        {open ? <FiChevronDown size={22} /> : <FiChevronUp size={22} />}
      </button>

      {/* Side Panel */}
      <div
        className={`fixed z-30 top-0 right-0 h-full bg-black/90 border-l border-white/10 backdrop-blur-xl transition-transform duration-300`}
        style={{ width: "30vw", minWidth: 320, maxWidth: 520, transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <FiMessageSquare />
            <span>{selectedChatId ? "Chat Room" : "Chat"}</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedChatId && (
              <button
                onClick={() => setSelectedChatId(null)}
                className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/20"
              >
                Back
              </button>
            )}
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-white">Hide</button>
          </div>
        </div>

        <div className="h-[calc(100%-48px)] overflow-hidden">
          {auth?.token ? (
            selectedChatId ? (
              <div className="h-full">
                <ChatRoom embedded chatId={selectedChatId} onBack={() => setSelectedChatId(null)} />
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <ChatInbox onSelect={(id) => setSelectedChatId(id)} />
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div>
                <p className="text-gray-300 mb-3">Login to view and send messages.</p>
                <a href="/login" className="inline-block px-4 py-2 rounded bg-emerald-600">Login</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
