import React from "react";

// Simple password strength calculator
export function calcPasswordStrength(password) {
  if (!password) return { score: 0, label: "Too short" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] || "Very Weak" };
}

export default function PasswordStrength({ password }) {
  const { score, label } = calcPasswordStrength(password);

  const segments = [0, 1, 2, 3];

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {segments.map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded ${
              score > s
                ? score <= 1
                  ? "bg-red-500 shadow-sm"
                  : score === 2
                  ? "bg-yellow-500 shadow-sm"
                  : "bg-green-500 shadow-sm"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-300 mt-2">{label}</p>
    </div>
  );
}
