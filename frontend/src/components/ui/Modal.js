import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, children }) {
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") trapFocus(e);
    }

    function trapFocus(e) {
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    if (open) {
      lastActiveRef.current = document.activeElement;
      document.addEventListener("keydown", onKey);
      // Initial focus
      setTimeout(() => {
        const root = dialogRef.current;
        if (!root) return;
        const first = root.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (first || root).focus();
      }, 0);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      // Restore focus
      if (lastActiveRef.current && typeof lastActiveRef.current.focus === 'function') {
        lastActiveRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div ref={dialogRef} className="w-full max-w-lg rounded-2xl bg-[#0b1020] border border-white/10 p-6 outline-none" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
