import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiUsers, FiBox, FiBell, FiSettings, FiLogOut, FiPlus, FiStar, FiBarChart2 } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);

  const mainLinks = [
    { to: "/admin", label: "Dashboard", icon: <FiHome /> },
  ];

  const managementLinks = [
    { to: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
    { to: "/admin/auctions", label: "Auctions", icon: <FiBox /> },
    { to: "/admin/auctions/add", label: "Create Auction", icon: <FiPlus /> },
    { to: "/admin/kyc", label: "Verify Sellers", icon: <FiStar /> },
  ];

  const toolsLinks = [
    { to: "/admin/stats", label: "Statistics", icon: <FiBarChart2 /> },
    { to: "/admin/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/admin/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl 
                 border-r border-white/20 shadow-2xl flex flex-col p-6 z-40 overflow-y-auto"
    >
      <h1 className="text-3xl font-extrabold text-white mb-10
        bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        ADMIN
      </h1>

      <nav className="flex-1 space-y-6">
        {/* Main */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Main</p>
          <div className="space-y-2">
            {mainLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive ? 
                    "bg-blue-600 text-white shadow-lg" :
                    "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{l.icon}</span>
                <span className="text-sm font-semibold">{l.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Management */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Management</p>
          <div className="space-y-2">
            {managementLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive ? 
                    "bg-purple-600 text-white shadow-lg" :
                    "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{l.icon}</span>
                <span className="text-sm font-semibold">{l.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Tools & Settings */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tools</p>
          <div className="space-y-2">
            {toolsLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive ? 
                    "bg-emerald-600 text-white shadow-lg" :
                    "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{l.icon}</span>
                <span className="text-sm font-semibold">{l.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <button
        onClick={logout}
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl 
                 bg-red-600 text-white hover:bg-red-700 transition shadow-lg w-full justify-center font-semibold"
      >
        <FiLogOut className="text-lg" /> Logout
      </button>
    </motion.aside>
  );
}
