import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to the top of the window on every route change
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}
