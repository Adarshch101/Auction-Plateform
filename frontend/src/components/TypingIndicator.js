export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      ></div>
      <div
        className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      ></div>
    </div>
  );
}
