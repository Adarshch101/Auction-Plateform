export default function ChatBubble({ message, isMine }) {
  const text = message.displayText || message.message || "";
  // Audio marker formats:
  // - Legacy: [AUDIO]<data-url>
  // - New: [AUDIO;type=... ]<data-url>
  let isAudio = false;
  let audioSrc = null;
  if (typeof text === 'string' && text.startsWith('[AUDIO')) {
    const end = text.indexOf(']');
    const payload = end !== -1 ? text.slice(end + 1) : text.replace('[AUDIO]', '');
    if (payload && payload.startsWith('data:')) {
      isAudio = true;
      audioSrc = payload;
    }
  }
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl shadow-md backdrop-blur-lg border ${
          isMine ? "bg-blue-600/40 border-blue-400 text-white" : "bg-white/10 border-white/30 text-gray-200"
        }`}
      >
        {isAudio ? (
          <audio controls src={audioSrc} className="max-w-full" />
        ) : (
          <p className="text-sm">{text}</p>
        )}
        <p className="text-[10px] opacity-60 mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
