import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiPlus,
  FiCreditCard,
  FiList,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "../NotificationBell";

export default function SellerSidebar() {
  const { logout } = useContext(AuthContext);

  const mainLinks = [
    { to: "/seller/dashboard", label: "Dashboard", icon: <FiHome /> },
  ];

  const managementLinks = [
    { to: "/seller/add", label: "Add Product", icon: <FiPlus /> },
    { to: "/seller/wallet", label: "Wallet", icon: <FiCreditCard /> },
    { to: "/seller/orders", label: "Orders", icon: <FiList /> },
  ];

  const toolsLinks = [
    { to: "/seller/stats", label: "Stats", icon: <FiBarChart2 /> },
    { to: "/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/seller/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="
        fixed left-0 top-0 h-full w-64 pt-24
        bg-gradient-to-b from-black/40 via-black/20 to-black/40
        backdrop-blur-2xl border-r border-white/20 
        shadow-[0_0_40px_rgba(0,255,255,0.25)]
        flex flex-col p-6 z-40 overflow-y-auto relative
      "
    >

      {/* AURORA NEON LIGHT EFFECT */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-6 w-48 h-48 bg-cyan-500 blur-[130px]" />
        <div className="absolute bottom-14 right-5 w-48 h-48 bg-purple-600 blur-[150px]" />
      </div>

      {/* BRAND LOGO */}
      <h1
        className="
          text-3xl font-extrabold mb-8 relative z-10
          bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 
          text-transparent bg-clip-text
          drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]
        "
      >
        SELLER
      </h1>

      {/* NOTIFICATION BELL CARD */}
      <div className="mb-6 relative z-10">
        <div
          className="
            p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl 
            shadow-[0_0_25px_rgba(0,255,255,0.25)]
            hover:bg-white/20 transition cursor-pointer
          "
        >
          <NotificationBell />
        </div>
      </div>

      {/* NAVIGATION SECTIONS */}
      <nav className="flex-1 space-y-8 relative z-10">

        {/* Main */}
        <SidebarSection title="Main">
          {mainLinks.map((l) => (
            <SidebarLink key={l.to} {...l} activeColor="cyan" />
          ))}
        </SidebarSection>

        {/* Manage */}
        <SidebarSection title="Management">
          {managementLinks.map((l) => (
            <SidebarLink key={l.to} {...l} activeColor="purple" />
          ))}
        </SidebarSection>

        {/* Tools */}
        <SidebarSection title="Tools">
          {toolsLinks.map((l) => (
            <SidebarLink key={l.to} {...l} activeColor="emerald" />
          ))}
        </SidebarSection>
      </nav>

      {/* LOGOUT BUTTON */}
      <button
        onClick={logout}
        className="
          mt-6 flex items-center gap-3 px-4 py-3 rounded-xl 
          bg-red-600 text-white hover:bg-red-700 
          shadow-[0_0_22px_rgba(255,0,0,0.3)]
          transition w-full justify-center font-semibold relative z-10
        "
      >
        <FiLogOut className="text-lg" /> Logout
      </button>
    </motion.aside>
  );
}

/* ===========================
   SECTION HEADER COMPONENT
=========================== */
function SidebarSection({ title, children }) {
  return (
    <div>
      <p className="
        text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 
        drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]
      ">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* ===========================
   CUSTOM SIDEBAR LINK
=========================== */
function SidebarLink({ to, label, icon, activeColor }) {
  const glow = {
    cyan: "bg-cyan-600 shadow-[0_0_18px_rgba(0,255,255,0.55)]",
    purple: "bg-purple-600 shadow-[0_0_18px_rgba(170,0,255,0.55)]",
    emerald: "bg-emerald-600 shadow-[0_0_18px_rgba(0,255,170,0.55)]",
  }[activeColor];

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-xl transition 
        ${
          isActive
            ? `${glow} text-white`
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }
      `
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </NavLink>
  );
}
