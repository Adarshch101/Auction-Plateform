import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import ChatBubble from "../components/ChatBubble";
import TypingIndicator from "../components/TypingIndicator";
import UserAvatar from "../components/UserAvatar";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const socket = io("http://localhost:4000");

/* ======================================================
   ⭐ FULLSCREEN ROTATING ARTIFACT (GLOBAL BACKGROUND)
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
        duration: 45,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

/* ======================================================
   ⭐ CHAT PAGE
====================================================== */
export default function ChatRoom({ chatId: chatIdProp, embedded = false, onBack }) {
  const { chatId: chatIdFromParams } = useParams();
  const chatId = chatIdProp || chatIdFromParams;
  const { auth } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [online, setOnline] = useState(false);
  const [myId, setMyId] = useState(null);
  const [closing, setClosing] = useState(false);
  const [sendingQuick, setSendingQuick] = useState(false);
  const [translateOn, setTranslateOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordTimer, setRecordTimer] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  /* Resolve user ID */
  useEffect(() => {
    const resolved = auth?.userId || localStorage.getItem("userId");
    if (resolved) {
      setMyId(resolved);
    } else {
      api
        .get("/auth/me")
        .then((res) => {
          const id = res.data?._id;
          if (id) {
            setMyId(id);
            try {
              localStorage.setItem("userId", id);
            } catch {}
          }
        })
        .catch(() => {});
    }
  }, [auth?.userId]);

  /* Socket + chat initialization */
  useEffect(() => {
    socket.emit("joinChat", chatId);

    const regId = auth?.userId || localStorage.getItem("userId");
    if (regId) socket.emit("registerUser", regId);

    api.get(`/chat/${chatId}`).then((res) => setMessages(res.data));

    api.get("/chat").then((res) => {
      const chat = res.data.find((c) => c._id === chatId);
      setChatInfo(chat);
    });

    socket.on("newMessage", (msg) => {
      if (msg.chatId === chatId) setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 2000);
    });
  }, [chatId, auth?.userId]);

  /* Presence updates */
  useEffect(() => {
    if (!chatInfo || !chatInfo.users) return;
    const currentId = myId || auth?.userId;
    const other = chatInfo.users.find((u) => u._id !== currentId);
    if (!other) return;

    let mounted = true;

    const fetchPresence = async () => {
      try {
        const res = await api.get(`/chat/presence/${other._id}`);
        if (mounted) setOnline(!!res.data?.online);
      } catch {}
    };

    fetchPresence();
    const t = setInterval(fetchPresence, 8000);

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [chatInfo, auth?.userId]);

  /* Send Message */
  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post(`/chat/${chatId}`, { text });

    socket.emit("sendMessage", {
      chatId,
      message: text,
      senderId: auth.userId,
    });

    setText("");
  };

  const sendQuick = async (messageText) => {
    if (!messageText) return;
    try {
      setSendingQuick(true);
      await api.post(`/chat/${chatId}`, { text: messageText });
      socket.emit("sendMessage", {
        chatId,
        message: messageText,
        senderId: auth.userId,
      });
    } catch (e) {
      // no-op; backend errors will still show via toast on server hooks if any
    } finally {
      setSendingQuick(false);
    }
  };

  // AI: Summarize conversation (component scope)
  const summarizeConversation = async () => {
    try {
      if (summarizing) return;
      setSummarizing(true);
      const texts = messages.map((m) => m.message).filter(Boolean).slice(-200); // last 200 messages max
      const res = await api.post('/ai/summarize', { messages: texts });
      const summary = res?.data?.summary || 'Summary unavailable.';
      // Post summary as a system message in the chat for both users to see
      const payload = `[SUMMARY] ${summary}`;
      await api.post(`/chat/${chatId}`, { text: payload });
      socket.emit('sendMessage', { chatId, message: payload, senderId: auth.userId });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Summarization not available.');
    } finally {
      setSummarizing(false);
    }
  };

  // AI: Transcribe latest voice note (component scope)
  const transcribeLatestVoice = async () => {
    try {
      if (transcribing) return;
      setTranscribing(true);
      // Find the latest audio message
      const lastAudio = [...messages].reverse().find((m) => typeof m.message === 'string' && m.message.startsWith('[AUDIO'));
      if (!lastAudio) {
        toast.error('No voice note found in this chat.');
        return;
      }
      // Extract data URL after closing bracket
      const idx = lastAudio.message.indexOf(']');
      const dataUrl = idx !== -1 ? lastAudio.message.slice(idx + 1) : lastAudio.message.replace('[AUDIO]', '');
      if (!dataUrl || !dataUrl.startsWith('data:')) {
        toast.error('Invalid voice note format.');
        return;
      }
      const res = await api.post('/ai/transcribe', { audioDataUrl: dataUrl });
      const textOut = res?.data?.text || 'Transcription unavailable.';
      const payload = `[TRANSCRIPT] ${textOut}`;
      await api.post(`/chat/${chatId}`, { text: payload });
      socket.emit('sendMessage', { chatId, message: payload, senderId: auth.userId });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Transcription not available.');
    } finally {
      setTranscribing(false);
    }
  };

  const onTyping = () => {
    socket.emit("typing", {
      chatId,
      sender: myId || auth.userId,
    });
  };

  const translateText = async (t) => {
    // Placeholder for integration with translation provider
    return t;
  };

  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!messages || messages.length === 0) {
        if (mounted) setDisplayMessages([]);
        return;
      }
      if (!translateOn) {
        if (mounted) setDisplayMessages(messages.map((m) => ({ ...m, displayText: m.message })));
        return;
      }
      // translate sequentially to keep it simple
      const out = [];
      for (const m of messages) {
        const txt = await translateText(m.message || "");
        out.push({ ...m, displayText: txt });
      }
      if (mounted) setDisplayMessages(out);
    };
    run();
    return () => { mounted = false; };
  }, [messages, translateOn]);

  // Voice notes
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick best supported mime for wider playback compatibility
      const candidates = [
        'audio/mp4;codecs=mp4a.40.2',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
      ];
      const mime = candidates.find((c) => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) || 'audio/webm;codecs=opus';
      const rec = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 64000 });
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: mime.split(';')[0] || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioPreview(reader.result); // data URL
        };
        reader.readAsDataURL(blob);
        setAudioBlob(blob);
        // stop all tracks
        try { stream.getTracks().forEach(t => t.stop()); } catch {}
      };
      rec.start();
      setRecorder(rec);
      setAudioChunks(chunks);
      setRecording(true);
      setAudioPreview(null);
      setAudioBlob(null);
      // Auto-stop after 10s to keep payload small
      const t = setTimeout(() => { try { rec.stop(); } catch {} }, 10000);
      setRecordTimer(t);
    } catch (e) {
      toast.error('Microphone permission denied or unavailable');
    }
  };

  const stopRecording = () => {
    try {
      if (recorder && recording) {
        recorder.stop();
      }
    } finally {
      setRecording(false);
      if (recordTimer) { clearTimeout(recordTimer); setRecordTimer(null); }
    }
  };

  const sendVoiceNote = async () => {
    if (!audioPreview) return;
    // Block oversized payloads (approx threshold ~350KB)
    const maxBytes = 700 * 1024;
    if (audioBlob && audioBlob.size > maxBytes) {
      toast.error('Voice note is too large. Please record a shorter clip.');
      return;
    }
    // Include mime hint for future parsing if needed
    const mimeHint = audioBlob ? (audioBlob.type || 'audio/webm') : 'audio/webm';
    const textPayload = `[AUDIO;type=${mimeHint}]${audioPreview}`;
    await api.post(`/chat/${chatId}`, { text: textPayload });
    socket.emit('sendMessage', { chatId, message: textPayload, senderId: auth.userId });
    setAudioPreview(null);
    setAudioBlob(null);
  };

  const otherUser = chatInfo?.users?.find(
    (u) => u._id !== (myId || auth?.userId || localStorage.getItem("userId"))
  );

  const isClosed = !!chatInfo?.closed;

  const closeChat = async () => {
    if (!window.confirm("Close this chat for both participants?")) return;
    try {
      setClosing(true);
      await api.post(`/chat/${chatId}/close`);
      setChatInfo((prev) => ({
        ...prev,
        closed: true,
        closedBy: myId || auth?.userId || null,
        closedAt: new Date().toISOString(),
      }));
      toast.success("Chat closed");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to close chat");
    } finally {
      setClosing(false);
    }
  };

  /* ============================================
        PAGE UI WITH ROTATING ARTIFACT
  ============================================ */
  return (
    <div className={`h-full flex flex-col relative overflow-hidden`}>

      {/* 🔮 GODMODE ROTATING ARTIFACT */}
      {!embedded && <FullscreenArtifact />}

      {/* HEADER (sticky) */}
      <div className="p-4 flex items-center justify-between bg-gray-900/70 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {embedded && (
            <button onClick={onBack} className="px-2 py-1 text-sm rounded bg-white/10 border border-white/20">Back</button>
          )}
          <UserAvatar name={otherUser?.name} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {otherUser?.name}
                {otherUser?.kycVerified && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-600/30 border border-emerald-400/40 text-emerald-200">Verified</span>
                )}
              </h2>
              <span className={`w-2.5 h-2.5 rounded-full ${online ? "bg-green-400" : "bg-gray-500"}`} />
              <span className="text-xs text-gray-400">{online ? "Online" : "Offline"}</span>
            </div>

            {typingUser && typingUser !== (myId || auth.userId) && (
              <p className="text-sm text-green-400">Typing...</p>
            )}
          </div>
        </div>

        {/* Auction snippet */}
        {chatInfo?.auctionId && (
          <div className="hidden md:flex items-center gap-3">
            <img
              src={chatInfo.auctionId.image}
              className="w-10 h-10 rounded object-cover border border-white/20"
            />
            <span className="text-sm text-gray-300 max-w-[230px] line-clamp-1">
              {chatInfo.auctionId.title}
            </span>
          </div>
        )}

        {/* AI + Translate + Close */}
        <div className="ml-4 flex items-center gap-2">
          <button
            onClick={summarizeConversation}
            disabled={isClosed || summarizing}
            className="px-3 py-1.5 rounded-lg border text-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            {summarizing ? 'Summarizing...' : 'Summarize'}
          </button>
          <button
            onClick={transcribeLatestVoice}
            disabled={isClosed || transcribing}
            className="px-3 py-1.5 rounded-lg border text-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            {transcribing ? 'Transcribing...' : 'Transcribe Latest'}
          </button>
          <label className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/10">
            <input type="checkbox" checked={translateOn} onChange={(e) => setTranslateOn(e.target.checked)} />
            Translate
          </label>
          <button
            onClick={closeChat}
            disabled={isClosed || closing}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              isClosed
                ? "bg-gray-700 border-gray-600 cursor-not-allowed"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            {isClosed ? "Closed" : closing ? "Closing..." : "Close Chat"}
          </button>
        </div>
      </div>

      {/* CLOSED BANNER */}
      {isClosed && (
        <div className="bg-yellow-900/40 text-yellow-200 text-sm px-4 py-2 text-center border-b border-yellow-700/40 relative z-10">
          This chat has been closed. You can no longer send messages.
        </div>
      )}

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-28 space-y-2 bg-black/80 backdrop-blur-xl relative z-10">
        {displayMessages.map((msg) => {
          const sender = typeof msg.senderId === "string" ? msg.senderId : msg.senderId?._id;
          const me = (myId || auth.userId || localStorage.getItem("userId"));
          const isMine = sender && me && String(sender) === String(me);
          return (
            <ChatBubble key={msg._id} message={msg} isMine={!!isMine} />
          );
        })}

        {typingUser && typingUser !== (myId || auth.userId) && <TypingIndicator />}
      </div>

      {/* INPUT + QUICK ACTIONS (sticky bottom) */}
      <div className="p-4 bg-gray-900/70 backdrop-blur-xl flex flex-col gap-3 sticky bottom-0 z-20 border-t border-gray-800">
        {audioPreview && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
            <audio controls src={audioPreview} className="max-w-full" />
            <button onClick={() => setAudioPreview(null)} className="px-3 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/20 text-sm">Discard</button>
            <button onClick={sendVoiceNote} className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-sm">Send Voice</button>
          </div>
        )}
        <div className="flex gap-3">
          <input
            className="flex-1 p-3 bg-gray-800 rounded-xl outline-none text-white"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onTyping}
            disabled={isClosed}
          />
          <button
            onClick={sendMessage}
            disabled={isClosed}
            className={`px-6 rounded-xl font-semibold ${
              isClosed ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            Send
          </button>
          {!recording ? (
            <button
              onClick={startRecording}
              disabled={isClosed}
              className="px-4 rounded-xl font-semibold bg-white/10 border border-white/20 hover:bg-white/20"
            >
              🎤 Record (max 10s)
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 rounded-xl font-semibold bg-red-600 hover:bg-red-700"
            >
              ■ Stop
            </button>
          )}
        </div>
        {/* Quick actions moved to bottom */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => sendQuick("Could you please send additional photos from different angles?")}
            disabled={isClosed || sendingQuick}
            className="px-3 py-1.5 rounded-lg border text-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            Request Photos
          </button>
          <button
            onClick={() => sendQuick("Could you provide the certificate of authenticity if available?")}
            disabled={isClosed || sendingQuick}
            className="px-3 py-1.5 rounded-lg border text-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            Request Certificate
          </button>
          <button
            onClick={async () => {
              const amt = window.prompt("Enter your offer amount (₹)");
              if (!amt) return;
              await sendQuick(`[OFFER] ₹${amt}`);
            }}
            disabled={isClosed || sendingQuick}
            className="px-3 py-1.5 rounded-lg border text-sm bg-emerald-600/70 hover:bg-emerald-600"
          >
            Make Offer
          </button>
        </div>
      </div>

    </div>
  );
}
