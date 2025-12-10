export default function UserAvatar({ name }) {
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
    flex items-center justify-center text-white font-bold shadow-lg">
      {initials}
    </div>
  );
}
