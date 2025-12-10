import { useMemo } from "react";
import { useSettings } from "../context/SettingsContext";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export function formatCurrency(amount, currency = "INR") {
  try {
    const code = (currency || "INR").toUpperCase();
    // Prefer Intl if available for proper grouping
    const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: 2 });
    return fmt.format(Number(amount || 0));
  } catch {
    const code = (currency || "INR").toUpperCase();
    const sym = CURRENCY_SYMBOLS[code] || "";
    return `${sym}${Number(amount || 0).toFixed(2)}`;
  }
}

export function useFormatCurrency() {
  const { settings } = useSettings();
  const code = (settings?.defaultCurrency || "INR").toUpperCase();
  const format = useMemo(() => (value) => formatCurrency(value, code), [code]);
  return { format, currency: code };
}
