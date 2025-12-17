import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const SUGGESTIONS = [
  "How do auctions work?",
  "How does bidding work?",
  "What is the minimum bid increment?",
  "What happens if two bids are the same?",
  "What is a reserve price?",
  "Do auctions extend if someone bids last second?",
  "Can I cancel a bid?",
  "How do I see my bidding history?",
  "Where can I track my orders?",
  "How do I checkout after winning?",
  "What payment methods are supported?",
  "My payment failed—what should I do?",
  "How long do refunds take?",
  "Do you charge taxes or duties?",
  "Can I get an invoice for my order?",
  "I didn't receive my OTP",
  "How do I reset my password?",
  "How do I enable two-factor authentication?",
  "How do I update my email or phone?",
  "How to manage notification settings?",
  "How do I become a seller?",
  "What are seller commissions?",
  "When do sellers get paid?",
  "What KYC documents are required?",
  "How long does verification take?",
  "How do I list a new product?",
  "How to edit or remove a listing?",
  "Are products authentic?",
  "What is the return policy?",
  "How do I contact the seller?",
  "How do shipping and insurance work?",
  "How do I change my shipping address?",
  "How to track my shipment?",
  "Do you ship internationally?",
  "How do I use wishlist?",
  "How do saved searches work?",
  "How to compare products?",
  "How to report an issue with an item?",
  "How to report a counterfeit?",
  "How to dispute an order?",
  "What fees apply to sellers?",
  "What are seller rankings?",
  "How to view seller stats?",
  "How to message a buyer or seller?",
  "How does chat work?",
  "How to change my profile picture?",
  "How to delete my account?",
  "What are site hours and support contacts?",
  "How to enable dark mode?",
  "Why was my account restricted?",
  "How to clear cache or fix loading issues?",
  "Do you have a mobile app?",
  "What is proxy bidding?",
  "Can I set a maximum auto-bid?",
  "How are bid increments calculated?",
  "When do auctions usually start or end?",
  "Can I follow sellers or categories?",
  "How do I report a user?",
  "Can I block messages from someone?",
  "How do I change currency or locale?",
  "How are timezones handled in auctions?",
  "Do you support multiple languages?",
  "How do I download my invoice history?",
  "Can I apply coupons or credits?",
  "Do you offer gift cards?",
  "How do I enable email/SMS/push notifications?",
  "How do I recover my account if I lost access?",
  "How do I verify my email or phone number?",
  "What is buyer protection?",
  "What is seller protection?",
  "How do I set up two-step verification?",
  "How to get alerts for new auctions?",
];

// Direct Q&A for suggestion chips. If the user's message matches one of these
// questions exactly (case-insensitive), we return the mapped answer directly.
const FAQ_ANSWERS = {
  "How do auctions work?":
    "Each item runs for a set duration with a visible timer. Some items have a reserve price. When time ends (with possible anti‑sniping extension), the highest valid bid wins.",
  "How does bidding work?":
    "On the item page, enter your bid ≥ current bid + minimum increment. The system validates your bid and updates the current price in real time.",
  "What is the minimum bid increment?":
    "Each auction defines increments by price band. Check the item page just below the current price to see the increment required.",
  "What happens if two bids are the same?":
    "If two bids are equal, the earlier bid has priority. Increase your bid to take the lead.",
  "What is a reserve price?":
    "A reserve price is the hidden minimum the seller will accept. If bidding doesn’t reach it, the item may not be sold.",
  "Do auctions extend if someone bids last second?":
    "Some auctions use anti‑sniping. A last‑second bid extends the timer briefly to allow fair competition.",
  "Can I cancel a bid?":
    "Bids are generally binding. If you made a mistake, contact support immediately—we’ll review case‑by‑case.",
  "How do I see my bidding history?":
    "Open the item page for recent activity; see your own bids and results under Profile > Notifications/Orders.",
  "Where can I track my orders?":
    "Go to Profile > Orders to view status, tracking links, and invoices.",
  "How do I checkout after winning?":
    "You’ll receive a win notification. Proceed from the item page or Profile > Orders and complete payment within the stated window.",
  "What payment methods are supported?":
    "We support major cards, UPI, and net‑banking via our payment gateway. Availability may vary by region.",
  "My payment failed—what should I do?":
    "If a payment fails, you won’t be charged. Any pending holds auto‑release by your bank. Try again or switch method; contact support if it persists.",
  "How long do refunds take?":
    "Refunds typically settle within 5–7 business days depending on your bank/payment method.",
  "Do you charge taxes or duties?":
    "Taxes/duties depend on destination and item type. Estimates are shown at checkout; international orders may incur import duties.",
  "Can I get an invoice for my order?":
    "Yes. Download invoices from your order details in Profile > Orders after payment is confirmed.",
  "I didn't receive my OTP":
    "Confirm your email, check spam, and wait up to 1 minute. Use Resend OTP after the countdown. If still missing, contact support@antiquexx.com.",
  "How do I reset my password?":
    "Use the Forgot Password link on the Login page. We’ll email a reset link or code to verify ownership.",
  "How do I enable two-factor authentication?":
    "Enable 2FA in Profile > Settings. You’ll verify with a one‑time code during login for extra security.",
  "How do I update my email or phone?":
    "Update contact details from Profile. For security, we may ask you to confirm via a code.",
  "How to manage notification settings?":
    "In Profile > Settings, configure email/SMS/push notifications. Ensure browser permissions are allowed for push.",
  "How do I become a seller?":
    "Go to Seller > Join, complete onboarding and KYC. After approval, you can list products and start auctions.",
  "What are seller commissions?":
    "Commissions vary by category and sale price. See Seller > Commission Info for current tiers and examples.",
  "When do sellers get paid?":
    "Payouts are released after successful delivery/confirmation per policy to your linked account.",
  "What KYC documents are required?":
    "Typically government ID and address proof. Upload under Seller > KYC. Processing takes 1–3 business days.",
  "How long does verification take?":
    "KYC reviews usually complete within 1–3 business days. We’ll notify you once approved.",
  "How do I list a new product?":
    "Seller > Add Product: provide title, description, images, category, and choose auction or fixed‑price.",
  "How to edit or remove a listing?":
    "Use Seller Dashboard to edit or end listings. You cannot end auctions with active bids unless policy allows.",
  "Are products authentic?":
    "Listings include condition notes and provenance where available. Sellers are vetted; report concerns from the item page.",
  "What is the return policy?":
    "Return windows and eligibility vary by item/category. See the item page and your order details for specifics.",
  "How do I contact the seller?":
    "Use the chat button on the item or seller page. Keep communications on‑platform for safety.",
  "How do shipping and insurance work?":
    "Orders ship with tracking and insurance by default. Coverage details are outlined in Shipping Policies.",
  "How do I change my shipping address?":
    "Update address in Profile. For placed orders not yet shipped, contact support to request a change.",
  "How to track my shipment?":
    "Find tracking links in Profile > Orders once the seller dispatches your item.",
  "Do you ship internationally?":
    "Yes for many items. Costs and duties vary by destination; see item page and Shipping Policies.",
  "How do I use wishlist?":
    "Click the heart icon to save items. You’ll get quick access and updates when items change.",
  "How do saved searches work?":
    "Save a search with filters to receive alerts when matching items are listed.",
  "How to compare products?":
    "Use Compare to view specs, photos, and prices side‑by‑side.",
  "How to report an issue with an item?":
    "Use Report on the item page and include details/photos. Our team will review promptly.",
  "How to report a counterfeit?":
    "Report from the item page or contact support with documentation; we investigate and take action.",
  "How to dispute an order?":
    "Open a support ticket with order ID and details. We’ll mediate under buyer/seller protection policies.",
  "What fees apply to sellers?":
    "Sales commissions and potential payment/shipping fees apply. See Seller > Commission Info for a breakdown.",
  "What are seller rankings?":
    "Rankings consider sales, ratings, and reliability. See Seller > Rankings for details.",
  "How to view seller stats?":
    "Seller Dashboard > Stats shows performance, orders, and payout insights.",
  "How to message a buyer or seller?":
    "Use built‑in chat from item or profile pages. Keep all communications on‑platform.",
  "How does chat work?":
    "Open Chat from the header or item page to start a conversation and attach messages/photos where supported.",
  "How to change my profile picture?":
    "Go to Profile and upload a clear, square image for best results.",
  "How to delete my account?":
    "Request deletion from Profile or contact support. We may retain records required by law.",
  "What are site hours and support contacts?":
    "Support is available Mon–Sat, 10AM–7PM (IST). Email support@antiquexx.com or call +91 9876543210.",
  "How to enable dark mode?":
    "Dark theme is enabled by default. Custom themes may be added in future updates.",
  "Why was my account restricted?":
    "We restrict accounts for policy or security reasons. Check your email for details or contact support to appeal.",
  "How to clear cache or fix loading issues?":
    "Try clearing browser cache, disabling extensions, and hard reload. If issues persist, share console logs with support.",
  "Do you have a mobile app?":
    "Use our mobile‑optimized web app today. Native apps are planned—watch announcements.",
  "What is proxy bidding?":
    "Set a maximum bid and the system auto‑bids for you by increments to keep you in the lead up to your max.",
  "Can I set a maximum auto-bid?":
    "Yes—use proxy bidding on the item page to set your maximum. We’ll auto‑bid up to that amount.",
  "How are bid increments calculated?":
    "They follow price bands (e.g., higher price → larger increments). See the increment indicator on the item page.",
  "When do auctions usually start or end?":
    "Start/end times are shown on item pages in your local timezone.",
  "Can I follow sellers or categories?":
    "Use wishlist and saved searches to track sellers/categories and receive alerts.",
  "How do I report a user?":
    "Report from the user's profile or chat conversation; we’ll review and take appropriate action.",
  "Can I block messages from someone?":
    "Yes—mute or block within chat to stop receiving messages from that user.",
  "How do I change currency or locale?":
    "Prices show in your selected locale where supported; otherwise default currency applies.",
  "How are timezones handled in auctions?":
    "Timers and schedules display in your local timezone automatically.",
  "Do you support multiple languages?":
    "English is supported now; additional languages are planned.",
  "How do I download my invoice history?":
    "Download invoices from each order. A full export is planned for a future release.",
  "Can I apply coupons or credits?":
    "Apply coupons/credits at checkout when available.",
  "Do you offer gift cards?":
    "Gift cards are planned—watch for future updates.",
  "How do I enable email/SMS/push notifications?":
    "Configure notifications in Profile > Settings and allow browser permissions for push.",
  "How do I recover my account if I lost access?":
    "Use Forgot Password, verify email/phone, or contact support with identity proof.",
  "How do I verify my email or phone number?":
    "We’ll send a code/link to verify. Check spam and use resend if needed.",
  "What is buyer protection?":
    "Buyer protection applies when you transact on‑platform and follow guidelines. Report issues within the window.",
  "What is seller protection?":
    "Ship on time with tracking to the confirmed address and keep proof of delivery to stay protected.",
  "How to get alerts for new auctions?":
    "Save searches for your keywords/categories to receive notifications when new items match.",
};

const FAQ_MAP = new Map(
  Object.entries(FAQ_ANSWERS).map(([k, v]) => [k.toLowerCase(), v])
);

function getBotReply(text) {
  const t = text.toLowerCase();
  // 1) Exact match against suggestion questions
  const direct = FAQ_MAP.get(t.trim());
  if (direct) return direct;
  if (/(otp|code)/.test(t)) {
    return "For OTP issues: ensure your email is correct, check spam, and wait up to 1 minute. You can use the Resend OTP button after the timer ends. If the problem persists, contact support@antiquexx.com.";
  }
  if (/(how\s+does\s+)?bidd?ing(\s+work)?|place\s+a\s+bid|bid\s+increment/.test(t)) {
    return "Bidding: Open an item’s detail page and enter your bid. Your bid must be ≥ current bid + minimum increment. The highest valid bid at auction close wins. You’ll see live updates on the page and via notifications.";
  }
  if (/(how\s+do\s+)?auctions?(\s+work)?|reserve\s+price|auction\s+close|time(\s+extension)?/.test(t)) {
    return "Auctions: Each item runs for a set duration. Some items may have a reserve price. When the timer ends, the highest valid bid wins. If specified, last‑second bids may extend the timer to prevent sniping.";
  }
  if (/(payment|pay|card|upi|netbank|wallet|refund|failed)/.test(t)) {
    return "Payments: We support major cards, UPI, and net‑banking (via our payment gateway). If a payment fails, you won’t be charged; pending holds auto‑release by your bank. Refunds typically settle within 5–7 business days.";
  }
  if (/(order|track|purchase|checkout)/.test(t)) {
    return "Orders & checkout: Add items to cart, proceed to Checkout, and view your order status under Profile > Wallet/Orders.";
  }
  if (/(become\s+a\s+seller|seller\s+signup|seller\s+join)/.test(t)) {
    return "Become a Seller: Go to Seller > Join and complete the onboarding steps, including KYC verification. Once approved, you can list products and participate in auctions.";
  }
  if (/(commission|fees|seller)/.test(t)) {
    return "Seller fees: Commissions vary by category and sale price. Check Seller > Commission Info for updated rates, examples, and payout timelines. KYC must be completed for withdrawals.";
  }
  if (/(account|profile|password|reset|login|logout)/.test(t)) {
    return "User account: Manage your details in Profile. You can update email, password, and preferences. For password resets, use the Forgot Password flow on the Login page.";
  }
  if (/(product|authentic|genuine|condition|returns?)/.test(t)) {
    return "Products: Listings include detailed descriptions and condition notes. Authenticity is verified by our sellers and audits; report concerns via the item page. Returns are handled per item’s policy and applicable laws.";
  }
  if (/(ship|shipping|delivery|policy)/.test(t)) {
    return "Shipping: We provide insured shipping and tracking on all orders. See Seller > Shipping Policies for timelines and coverage.";
  }
  if (/(contact|support|help|email|phone)/.test(t)) {
    return "You can reach us at support@antiquexx.com or +91 9876543210 (Mon–Sat · 10AM–7PM).";
  }
  if (/minimum\s+bid\s+increment|increment\s+rule|how\s+are\s+increments/.test(t)) {
    return "Minimum increment: Each auction defines increments by price band. Your bid must be at least current bid + increment shown on the item page.";
  }
  if (/same\s+bids?|tie\s+bid/.test(t)) {
    return "Same bids: If two bids are equal, the earlier bid has priority. Increase your bid to take the lead.";
  }
  if (/reserve\s+price/.test(t)) {
    return "Reserve price: Some items have a hidden minimum the seller will accept. If not met, the item may not be sold even if there are bids.";
  }
  if (/(last\s*second|snip(e|ing)|extend(ed)?\s*time|anti\s*snip)/.test(t)) {
    return "Anti‑sniping: Certain auctions extend briefly when a bid is placed near the end, giving all bidders a fair chance.";
  }
  if (/cancel\s+a?\s*bid|retract\s+bid/.test(t)) {
    return "Bid retraction: Bids are generally binding. If you made a mistake, contact support quickly; we’ll review case‑by‑case.";
  }
  if (/bidding\s+history|my\s+bids|where\s+are\s+my\s+bids/.test(t)) {
    return "Bidding history: Visit the item page for recent activity or check your Profile/Notifications for your own bids and outcomes.";
  }
  if (/checkout|won\s+an?\s+auction|claim\s+item/.test(t)) {
    return "Checkout after winning: You’ll receive a notification and can proceed to payment from the item page or your Profile. Complete payment within the stated window.";
  }
  if (/(refund|chargeback|tax|dut(y|ies)|invoice)/.test(t)) {
    return "Refunds & tax: Refunds settle in 5–7 business days depending on your bank. Taxes/duties depend on destination. You can download invoices from your orders.";
  }
  if (/(2fa|two\s*factor|two\s*step|enable\s+2fa)/.test(t)) {
    return "2FA: Enable two‑factor in your Profile settings. We’ll send a one‑time code during login for extra security.";
  }
  if (/(update|change).*(email|phone)|notification\s+settings?/.test(t)) {
    return "Account updates: Go to Profile to change email/phone and notification preferences (email/SMS/push where available).";
  }
  if (/(kyc|verification|documents|id\s+proof)/.test(t)) {
    return "KYC: Provide required ID/address documents under Seller > KYC. Review typically takes 1–3 business days.";
  }
  if (/seller\s+payout|when\s+do\s+sellers\s+get\s+paid|withdraw(al)?/.test(t)) {
    return "Payouts: After a successful sale and buyer confirmation, funds are released per policy to your linked account.";
  }
  if (/(list|create)\s+(a\s+)?(product|listing)/.test(t)) {
    return "List a product: Go to Seller > Add Product, fill details, upload images, and choose auction or fixed‑price options.";
  }
  if (/(edit|remove|delete)\s+(listing|product)/.test(t)) {
    return "Manage listings: From Seller Dashboard, edit details or end a listing if it has no active bids/reservations.";
  }
  if (/(return\s+policy|return|refund\s+policy)/.test(t)) {
    return "Returns: Policies vary by item and category. Check the item page. Eligible returns must be requested within the stated window.";
  }
  if (/(contact|message)\s+(the\s+)?seller/.test(t)) {
    return "Contact seller: Use the chat/message button on the item or seller page to ask questions before bidding.";
  }
  if (/(report)\s+(issue|problem|counterfeit|fake)/.test(t)) {
    return "Report issues: Use the Report option on the item page or contact support with details and evidence.";
  }
  if (/(dispute|conflict|problem)\s+(order|transaction)/.test(t)) {
    return "Order disputes: Open a support ticket with order ID and details. We’ll mediate per buyer/seller protection policies.";
  }
  if (/(insurance|insured)\s+shipping|shipping\s+insurance/.test(t)) {
    return "Shipping insurance: Orders are insured by default. Coverage details are listed in Shipping Policies.";
  }
  if (/(change|update)\s+(shipping\s+)?address/.test(t)) {
    return "Change address: Update your address in Profile. For active orders, contact support to request a change if not yet shipped.";
  }
  if (/(track|tracking)\s+(shipment|order)/.test(t)) {
    return "Tracking: Find the tracking link in your order details under Profile > Orders.";
  }
  if (/(international|overseas)\s+ship(ping)?/.test(t)) {
    return "International shipping: Available for many items; costs and duties depend on destination. See item page and Shipping Policies.";
  }
  if (/wishlist/.test(t)) {
    return "Wishlist: Save items to your wishlist to revisit quickly and receive notifications on changes.";
  }
  if (/(saved\s+search|save\s+search)/.test(t)) {
    return "Saved searches: Save a search with filters to get alerts when new matching items are listed.";
  }
  if (/compare\s+products?/.test(t)) {
    return "Compare: Use the Compare feature to view item specs, photos, and prices side‑by‑side.";
  }
  if (/(fees|commission)s?\s+apply\s+to\s+sellers?/.test(t)) {
    return "Seller fees: Commission rates vary by category and price. See Seller > Commission Info for current tiers.";
  }
  if (/seller\s+rank(ing|ings)/.test(t)) {
    return "Seller rankings: We rank based on sales, ratings, and reliability. Visit Seller > Rankings to learn more.";
  }
  if (/(message|chat)\s+(buyer|seller)/.test(t)) {
    return "Messaging: Use built‑in chat from item or profile pages. Keep communications on‑platform for safety.";
  }
  if (/change\s+profile\s+picture|avatar|update\s+photo/.test(t)) {
    return "Profile photo: Go to Profile and upload a new picture. Use a clear, square image for best results.";
  }
  if (/(delete|close)\s+my\s+account/.test(t)) {
    return "Delete account: Request deletion from Profile or contact support. We may retain records required by law.";
  }
  if (/(hours|support\s+hours|contact)/.test(t)) {
    return "Support hours: Mon–Sat, 10AM–7PM (IST). Email support@antiquexx.com or call +91 9876543210.";
  }
  if (/(dark\s*mode|theme)/.test(t)) {
    return "Dark mode: The site uses a dark theme by default. Theme options may be available in Settings in future updates.";
  }
  if (/(restricted|suspended|blocked)\s+account/.test(t)) {
    return "Restricted account: Check your email for details. Contact support to appeal or resolve outstanding issues.";
  }
  if (/(clear\s+cache|loading\s+issues|site\s+not\s+loading)/.test(t)) {
    return "Troubleshooting: Clear browser cache, disable extensions, and try a hard reload. If it persists, contact support with console logs.";
  }
  if (/(mobile\s+app|android|ios)/.test(t)) {
    return "Mobile: You can use the mobile‑optimized web app now. Native apps are planned; watch our announcements.";
  }
  if (/(proxy\s+bidding|auto\s*bid|maximum\s*bid)/.test(t)) {
    return "Proxy bidding: Set your maximum. The system auto‑bids the minimum needed to keep you in the lead up to your max.";
  }
  if (/(when|what\s+time).*(start|end).*auction/.test(t)) {
    return "Schedules: Auction start/end times are shown on item pages in your local timezone.";
  }
  if (/(follow|favorite).*(seller|category)/.test(t)) {
    return "Following: Use wishlist and saved searches to track sellers/categories and receive alerts.";
  }
  if (/(report\s+user|abuse|block\s+messages?)/.test(t)) {
    return "User safety: Report abuse from the user’s profile or chat. You can mute/block messages and we’ll review reports.";
  }
  if (/(currency|locale|language)/.test(t)) {
    return "Locale: Prices are shown in your selected currency/locale where supported; otherwise default currency applies.";
  }
  if (/(timezone|time\s+zone)/.test(t)) {
    return "Timezones: Auction timers display in your local timezone automatically.";
  }
  if (/(multi\s*language|languages?)/.test(t)) {
    return "Languages: English is supported now; additional languages are planned.";
  }
  if (/(download|export).*(invoice|invoices|history)/.test(t)) {
    return "Invoices: Download invoices from your order details. A full history export is coming soon.";
  }
  if (/(coupon|promo|credit|voucher|gift\s*card)/.test(t)) {
    return "Promos: Apply coupons/credits at checkout when available. Gift cards may be introduced in future updates.";
  }
  if (/(enable|turn\s*on).*(email|sms|push).*notifications?/.test(t)) {
    return "Notifications: Configure email/SMS/push in Profile > Settings. Ensure browser permissions are allowed for push.";
  }
  if (/(recover|lost\s+access|can’t\s+access|cant\s+access)\s+(account|my\s+account)/.test(t)) {
    return "Account recovery: Use Forgot Password, verify email/phone, or contact support with identity proof if you’re locked out.";
  }
  if (/(verify|verification).*(email|phone|number)/.test(t)) {
    return "Verification: We’ll send a code/link to verify your email/phone. Check spam and try resend if needed.";
  }
  if (/(buyer\s+protection)/.test(t)) {
    return "Buyer protection: Coverage applies when you transact on‑platform and follow guidelines. Report issues within the stated window.";
  }
  if (/(seller\s+protection)/.test(t)) {
    return "Seller protection: Ship on time with tracking to the confirmed address and keep proof of delivery to stay protected.";
  }
  if (/(alert|notify|notification).*new\s+auctions?/.test(t)) {
    return "New auction alerts: Save a search for your keywords/categories to receive notifications when new items match.";
  }
  return "I’m here to help. You can ask about auctions, OTP/login, orders, commissions, or shipping. For account-specific help, contact support@antiquexx.com.";
}

// Convert key phrases in replies to internal links for deeper guidance
function linkifyReply(s) {
  if (!s) return s;
  const links = [
    { label: /buyer\s+guide|how\s+bidding\s+works/i, href: "/help/buying", text: "Buyer Guide" },
    { label: /buyer\s+protection|returns?/i, href: "/help/buyer-protection", text: "Buyer Protection" },
    { label: /seller\s+handbook|seller\s+guide/i, href: "/help/seller-handbook", text: "Seller Handbook" },
    { label: /commission\s+info|seller\s+commissions?/i, href: "/seller/commission-info", text: "Commission Info" },
    { label: /shipping\s+polic(y|ies)/i, href: "/seller/shipping-policies", text: "Shipping Policies" },
    { label: /profile\s*>\s*orders/i, href: "/profile", text: "Profile > Orders" },
    { label: /support\s+chat/i, href: "/support", text: "Support Chat" },
  ];
  let out = s;
  links.forEach(({ label, href, text }) => {
    out = out.replace(label, `<a href="${href}" class="text-purple-300 underline hover:text-purple-200">${text}</a>`);
  });
  return out;
}

export default function Support() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m your support assistant. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false); // ✅ ADDED
  const endRef = useRef(null);
  const containerRef = useRef(null);

  const VISIBLE_SUGGESTIONS = useMemo(() => {
    const arr = [...SUGGESTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 5);
  }, []);

  const scrollToBottom = (smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || botTyping) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setBotTyping(true);

    // ✅ ADD typing indicator
    setMessages((m) => [...m, { from: "bot", typing: true }]);

    const reply = getBotReply(text);

    setTimeout(() => {
      // remove typing indicator
      setMessages((m) => m.filter((x) => !x.typing));
      const html = linkifyReply(reply);
      setMessages((m) => [...m, { from: "bot", html }]);
      setBotTyping(false);
    }, 900); // reply delay
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-10 px-4 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Support Chat</h1>
        <p className="text-gray-300 mb-6">Ask a question or pick a suggestion to get started.</p>

        <div className="flex gap-2 flex-wrap mb-4">
          {VISIBLE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          <div ref={containerRef} className="h-[50vh] overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) =>
              m.typing ? (
                <motion.div
                  key={`typing-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-[70%] bg-black/40 border border-purple-500/40 rounded-xl p-4 shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce delay-150" />
                    <span className="h-2 w-2 rounded-full bg-pink-400 animate-bounce delay-300" />
                    <span className="text-xs text-purple-300 ml-2">Bot is typing…</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    m.from === "bot"
                      ? "max-w-[85%] bg-white/10 border border-white/10 rounded-xl p-3"
                      : "max-w-[85%] ml-auto bg-purple-600/30 border border-purple-500/30 rounded-xl p-3"
                  }
                >
                  {m.html ? (
                    <div dangerouslySetInnerHTML={{ __html: m.html }} />
                  ) : (
                    m.text
                  )}
                </motion.div>
              )
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-3 flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={botTyping}
              placeholder={botTyping ? "Bot is replying…" : "Type your message..."}
              className="flex-1 resize-none bg-black/30 rounded-xl p-3 outline-none border border-white/10 focus:border-purple-400 disabled:opacity-40"
            />
            <button
              onClick={send}
              disabled={botTyping}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:opacity-90 disabled:opacity-40"
            >
              {botTyping ? "Thinking…" : "Send"}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          For account-specific help, reach us at support@antiquexx.com or +91 9876543210
        </p>
      </div>
    </div>
  );
}






