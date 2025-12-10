import { useState, useEffect } from "react";

export default function CaptchaCheckbox({ onChange }) {
  const [checked, setChecked] = useState(false);
  useEffect(() => { onChange?.(checked); }, [checked]);
  return (
    <label className="flex items-center gap-3 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-5 h-5 accent-cyan-500"
      />
      <span className="text-sm text-gray-300">I'm not a robot</span>
    </label>
  );
}
