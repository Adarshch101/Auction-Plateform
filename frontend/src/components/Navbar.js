import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "../components/ThemeToggle";

import {
  FiMenu,
  FiX,
  FiUser,
  FiHome,
  FiHeart,
  FiCreditCard,
  FiShoppingBag,
  FiLogOut,
  FiLogIn,
  FiShield,
} from "react-icons/fi";

export default function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-xl fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">

        {/* LEFT: LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
        >
          AntiqueXX
        </Link>

        {/* CENTER: MENU ITEMS */}
        <div className="hidden md:flex items-center gap-10 text-lg mx-auto">

          <NavItem to="/" icon={<FiHome />} label="Home" />
          <NavItem to="/auctions" icon={<FiShoppingBag />} label="Auctions" />
          <NavItem to="/wallet" icon={<FiCreditCard />} label="Wallet" />
          <NavItem to="/wishlist" icon={<FiHeart />} label="Wishlist" />

          {/* ADMIN */}
          {auth.role === "admin" && (
            <NavItem to="/admin" icon={<FiShield />} label="Admin" />
          )}

          {/* SELLER */}
          {auth.role === "seller" && (
            <NavItem to="/seller/dashboard" icon={<FiShoppingBag />} label="Seller" />
          )}
        </div>

        {/* RIGHT: AUTH + NOTIFICATIONS */}
        <div className="hidden md:flex items-center gap-6">

          {auth.token && <NotificationBell />}

          <ThemeToggle />

          {!auth.token ? (
            <>
              <NavItem to="/login" icon={<FiLogIn />} label="Login" />
              <NavItem to="/register" icon={<FiUser />} label="Register" />
            </>
          ) : (
            <>
              <NavItem to="/profile" icon={<FiUser />} label="Profile" />

              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-700 transition"
              >
                <FiLogOut /> Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(true)}>
          <FiMenu />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-gray-900 p-6 border-l border-gray-700 shadow-2xl animate-slideLeft">

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Menu</h3>
              <button onClick={() => setOpen(false)} className="text-2xl">
                <FiX />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-lg">

              <MobileItem to="/" icon={<FiHome />} label="Home" />
              <MobileItem to="/auctions" icon={<FiShoppingBag />} label="Auctions" />
              <MobileItem to="/wallet" icon={<FiCreditCard />} label="Wallet" />
              <MobileItem to="/wishlist" icon={<FiHeart />} label="Wishlist" />

              {auth.role === "admin" && (
                <MobileItem to="/admin" icon={<FiShield />} label="Admin" />
              )}

              {auth.role === "seller" && (
                <MobileItem to="/seller/dashboard" icon={<FiShoppingBag />} label="Seller" />
              )}

              {auth.token && <NotificationBell />}
              <div className="pt-2"><ThemeToggle /></div>

              {!auth.token ? (
                <>
                  <MobileItem to="/login" icon={<FiLogIn />} label="Login" />
                  <MobileItem to="/register" icon={<FiUser />} label="Register" />
                </>
              ) : (
                <>
                  <MobileItem to="/profile" icon={<FiUser />} label="Profile" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* MENU COMPONENTS */
function NavItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 hover:text-blue-400 transition"
    >
      {icon} {label}
    </Link>
  );
}

function MobileItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 hover:text-blue-400 transition"
    >
      {icon} {label}
    </Link>
  );
}
