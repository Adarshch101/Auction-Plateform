import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Canonical() {
  const location = useLocation();

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const href = origin + location.pathname + location.search;

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [location.pathname, location.search]);

  return null;
}
