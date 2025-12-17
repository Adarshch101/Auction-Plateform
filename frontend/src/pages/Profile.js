import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import io from "socket.io-client";

/**
 * Profile.jsx
 * Arcane × Cyberpunk GOD-MODE++ themed profile page.
 *
 * Paste over your existing Profile file. Keeps original logic,
 * but restyles markup, layout and animations.
 */

function Profile() {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalBids: 0,
    auctionsWon: 0,
    wallet: 0,
  });

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    bio: "",
    location: "",
    timezone: "",
    twitter: "",
    instagram: "",
    gstNumber: "",
    panNumber: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const [avatarSrc, setAvatarSrc] = useState(null);
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [avatarZoom, setAvatarZoom] = useState(1);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // pointer drag state - use ref to avoid re-renders
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otp, setOtp] = useState("");

  const [contactsMasked, setContactsMasked] = useState(true);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const otpTimerRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");

  // Stable background line positions to prevent reflow/scroll jumps on re-render
  const bgLinesRef = useRef(
    Array.from({ length: 18 }, () => ({
      left: Math.random() * 100,
      xStart: Math.random() * 1400 - 200,
    }))
  );

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  // socket ref so we can close on unmount
  const socketRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchMyAuctions();
    fetchWonAuctions();
    fetchStats();

    const s = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:4000");
    socketRef.current = s;

    try {
      const userId = localStorage.getItem("userId");
      if (userId) s.emit("registerUser", userId);
    } catch {}

    const refresh = () => {
      fetchWonAuctions();
      fetchOrders();
    };

    s.on("auctionEnded", refresh);
    s.on("purchaseCompleted", refresh);

    return () => {
      try {
        s.off("auctionEnded", refresh);
        s.off("purchaseCompleted", refresh);
        s.close();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ API FUNCTIONS ------------------

  async function fetchProfile() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);

      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        role: res.data.role || "",
        username: res.data.username || "",
        bio: res.data.bio || "",
        location: res.data.location || "",
        timezone: res.data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        twitter: res.data.twitter || "",
        instagram: res.data.instagram || "",
        gstNumber: res.data.gstNumber || "",
        panNumber: res.data.panNumber || "",
      });

      setAddresses(Array.isArray(res.data.addresses) ? res.data.addresses : []);
      setTwoFactorEnabled(!!res.data.twoFactorEnabled);
    } catch (e) {
      console.error("fetchProfile failed", e);
      toast.error("Failed to load profile");
    }
  }

  async function reauthenticateAndReveal() {
    try {
      await api.post("/auth/reauth", { password: reauthPassword });
      setContactsMasked(false);
      setShowReauthModal(false);
      setReauthPassword("");
      toast.success("Contacts revealed");
      if (pendingAction === "disable2FA") {
        setPendingAction("");
        try { await disable2FA(); } catch {}
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Re-authentication failed");
    }
  }

  async function fetchOrders() {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (e) {
      // silent
      console.error("fetchOrders", e);
    }
  }

  async function fetchMyAuctions() {
    try {
      const res = await api.get("/seller/my-auctions");
      setMyAuctions(res.data);
    } catch (e) {
      console.error("fetchMyAuctions", e);
    }
  }

  async function fetchWonAuctions() {
    try {
      const res = await api.get("/auctions/user/won");
      setWonAuctions(res.data || []);
    } catch (e) {
      console.error("fetchWonAuctions", e);
    }
  }

  async function fetchStats() {
    try {
      const res = await api.get("/auth/stats");
      setStats(res.data);
    } catch (e) {
      console.error("fetchStats", e);
    }
  }

  // ------------------ HELPERS & MUTATIONS ------------------

  function maskedEmail(email) {
    if (!email) return "Not added";
    const [name, domain] = String(email).split("@");
    if (!domain) return String(email);
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
  }

  function maskedPhone(phone) {
    if (!phone) return "Not added";
    const s = String(phone);
    if (s.length <= 4) return "****";
    return `${"*".repeat(s.length - 4)}${s.slice(-4)}`;
  }

  async function saveProfile() {
    try {
      const res = await api.put("/auth/update", form);
      if (res && res.data) {
        setUser(res.data);
      }
      toast.success("Profile updated");
      setEditMode(false);
      fetchProfile();
    } catch (e) {
      console.error("saveProfile", e);
      toast.error("Update failed");
    }
  }

  // Addresses helpers
  function validatePostalCountry(postal) {
    const s = String(postal || "").trim();
    if (/^\d{6}$/.test(s)) return "India";
    if (/^\d{5}$/.test(s)) return "USA";
    return "";
  }

  function openAddAddress() {
    setEditingIndex(-1);
    setAddrForm({
      label: "Home",
      name: user?.name || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: user?.phone || "",
      isDefault: addresses.length === 0,
    });
    setShowAddrModal(true);
  }

  function openEditAddress(i) {
    const a = addresses[i];
    if (!a) return;
    setEditingIndex(i);
    setAddrForm({
      label: a.label || "",
      name: a.name || "",
      line1: a.line1 || "",
      line2: a.line2 || "",
      city: a.city || "",
      state: a.state || "",
      postalCode: a.postalCode || "",
      country: a.country || "",
      phone: a.phone || "",
      isDefault: !!a.isDefault,
    });
    setShowAddrModal(true);
  }

  async function persistAddresses(next) {
    try {
      await api.put("/auth/update", { ...form, addresses: next });
      setAddresses(next);
      try {
        await fetchProfile();
      } catch {}
      toast.success("Addresses updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update addresses");
    }
  }

  async function saveAddressFromModal() {
    const required = ["name", "line1", "city", "state", "postalCode"];
    for (const k of required) {
      if (!String(addrForm[k] || "").trim()) {
        toast.error(`${k} is required`);
        return;
      }
    }
    let country = String(addrForm.country || "").trim();
    if (!country) country = validatePostalCountry(addrForm.postalCode);
    const clean = {
      ...addrForm,
      label: String(addrForm.label || "").trim(),
      name: String(addrForm.name || "").trim(),
      line1: String(addrForm.line1 || "").trim(),
      line2: String(addrForm.line2 || "").trim(),
      city: String(addrForm.city || "").trim(),
      state: String(addrForm.state || "").trim(),
      postalCode: String(addrForm.postalCode || "").trim(),
      country,
      phone: String(addrForm.phone || "").trim(),
    };

    let next = [...addresses];
    if (editingIndex >= 0) {
      next[editingIndex] = { ...next[editingIndex], ...clean };
    } else {
      next.push(clean);
    }
    if (clean.isDefault) {
      next = next.map((a, idx) => ({ ...a, isDefault: idx === (editingIndex >= 0 ? editingIndex : next.length - 1) }));
    } else if (!next.some(a => a.isDefault)) {
      next = next.map((a, idx) => ({ ...a, isDefault: idx === 0 }));
    }
    await persistAddresses(next);
    setShowAddrModal(false);
  }

  async function deleteAddress(i) {
    const next = addresses.filter((_, idx) => idx !== i);
    if (!next.some(a => a.isDefault) && next.length > 0) {
      next[0] = { ...next[0], isDefault: true };
    }
    await persistAddresses(next);
  }

  async function setDefaultAddress(i) {
    const next = addresses.map((a, idx) => ({ ...a, isDefault: idx === i }));
    await persistAddresses(next);
  }

  async function changePassword() {
    try {
      await api.put("/auth/change-password", passwords);
      toast.success("Password changed");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (e) {
      console.error("changePassword", e);
      toast.error("Password change failed");
    }
  }

  async function requestEnable2FA() {
    try {
      const res = await api.post("/auth/2fa/request");
      const cd = Number(res?.data?.cooldown) || 60;
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
      setOtpCooldown(cd);
      otpTimerRef.current = setInterval(() => {
        setOtpCooldown((s) => {
          if (s <= 1) {
            clearInterval(otpTimerRef.current);
            otpTimerRef.current = null;
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      toast.success("OTP sent to your email/phone");
      setShow2FAModal(true);
    } catch (e) {
      const remain = e?.response?.data?.remain;
      if (typeof remain === "number") {
        if (otpTimerRef.current) clearInterval(otpTimerRef.current);
        setOtpCooldown(remain);
        otpTimerRef.current = setInterval(() => {
          setOtpCooldown((s) => {
            if (s <= 1) {
              clearInterval(otpTimerRef.current);
              otpTimerRef.current = null;
              return 0;
            }
            return s - 1;
          });
        }, 1000);
        setShow2FAModal(true);
        toast.error(e?.response?.data?.message || "Please wait before requesting again");
      } else {
        console.error("requestEnable2FA", e);
        toast.error("Failed to initiate 2FA");
      }
    }
  }

  async function confirmEnable2FA() {
    try {
      await api.post("/auth/2fa/enable", { otp });
      toast.success("2FA enabled");
      setTwoFactorEnabled(true);
      setShow2FAModal(false);
      setOtp("");
    } catch (e) {
      console.error("confirmEnable2FA", e);
      toast.error("Invalid or expired OTP");
    }
  }

  async function disable2FA() {
    try {
      await api.post("/auth/2fa/disable");
      toast.success("2FA disabled");
      setTwoFactorEnabled(false);
    } catch (e) {
      console.error("disable2FA", e);
      const msg = e?.response?.data?.message || "Failed to disable 2FA";
      if (e?.response?.status === 401 && /Re-auth required/i.test(msg)) {
        setPendingAction("disable2FA");
        setShowReauthModal(true);
        toast.error("Please re-authenticate to disable 2FA");
      } else {
        toast.error(msg);
      }
    }
  }

  function downloadOrdersCSV() {
    try {
      const rows = [
        ["Order ID", "Auction", "Amount", "Date"],
        ...orders.map(o => [o._id || "", o.auctionId?.title || "", o.amount || 0, new Date(o.createdAt).toISOString()])
      ];
      const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("downloadOrdersCSV", e);
      toast.error("Failed to download statement");
    }
  }

  async function downloadInvoice(orderId) {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, { responseType: "blob" });
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("downloadInvoice", e);
      toast.error(e?.response?.data?.message || 'Failed to download invoice');
    }
  }

  async function deleteAccount() {
    try {
      setDeleting(true);
      await api.delete("/auth/delete");
      toast.success("Account deleted");
      try {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
      } catch (e) { }
      navigate("/login");
    } catch (e) {
      console.error("deleteAccount", e);
      toast.error(e?.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  // Avatar crop/save flow
  async function handleSaveAvatar() {
    try {
      if (!avatarSrc) return setShowAvatarCropper(false);
      setUploadingAvatar(true);

      const img = new Image();
      img.src = avatarSrc;

      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const ow = img.naturalWidth;
      const oh = img.naturalHeight;

      const size = Math.floor(Math.min(ow, oh) / avatarZoom);

      let sx = Math.floor((ow - size) / 2 + offsetX / avatarZoom);
      let sy = Math.floor((oh - size) / 2 + offsetY / avatarZoom);

      sx = Math.max(0, Math.min(ow - size, sx));
      sy = Math.max(0, Math.min(oh - size, sy));

      const canvas = document.createElement("canvas");
      const out = 400;
      canvas.width = out;
      canvas.height = out;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx, sy, size, size, 0, 0, out, out);

      let blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );

      if (!blob) {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        blob = new Blob([ab], { type: mimeString });
      }

      const file = new File([blob], `avatar_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const fd = new FormData();
      fd.append("avatar", file);

      const res = await api.post("/auth/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      toast.success("Avatar updated");
    } catch (e) {
      console.error("handleSaveAvatar", e);
      toast.error(e?.response?.data?.message || "Failed to update avatar");
    } finally {
      setUploadingAvatar(false);
      setShowAvatarCropper(false);
    }
  }

  // --------------------------- RENDER ---------------------------

  return (
    <div className="relative min-h-screen pt-28 px-6 pb-20 max-w-7xl mx-auto text-white overflow-hidden">
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#04050a] via-[#071026] to-[#03040a]" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.16),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(180,0,255,0.14),transparent_60%)]"></div>

        {/* subtle animated lines (positions memoized to avoid layout thrash on input) */}
        {bgLinesRef.current.map((line, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[200vh] bg-gradient-to-b from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 blur-[2px]"
            initial={{ x: line.xStart }}
            animate={{ y: ["-200vh", "200vh"] }}
            transition={{ duration: 8 + (i % 6), repeat: Infinity, ease: "linear" }}
            style={{ left: `${line.left}%`, opacity: 0.25 }}
          />
        ))}

        <motion.img
          src="https://i.ibb.co/Bz8YPBk/arcane-circle.png"
          className="absolute top-16 left-1/2 w-[900px] -translate-x-1/2 opacity-5"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          alt=""
        />
      </div>

      {/* PAGE TITLE & TABS */}
      <div className="relative z-10 mb-8">
        <motion.h1 initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 drop-shadow-[0_0_35px_rgba(0,200,255,0.25)]">
          My Profile
        </motion.h1>

        <div className="flex gap-3 flex-wrap">
          <Tab name="overview" label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
          <Tab name="buyer" label="Buyer" activeTab={activeTab} setActiveTab={setActiveTab} />
          {user?.role === "seller" && <Tab name="seller" label="Seller" activeTab={activeTab} setActiveTab={setActiveTab} />}
          <Tab name="wallet" label="Wallet" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 p-10 rounded-3xl bg-white/6 backdrop-blur-lg border border-white/6 shadow-[0_10px_60px_rgba(120,0,255,0.06)] space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
            className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-purple-600 shadow-lg flex items-center justify-center text-4xl font-bold ring-1 ring-white/10">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="select-none">{user?.name?.[0] || "U"}</span>
            )}
          </motion.div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  {user?.name || "Unnamed"}
                  {user?.role === "seller" && user?.kycVerified && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-600/30 border border-emerald-400/30 text-emerald-200">Verified</span>
                  )}
                </h2>
                <p className="text-gray-300 mt-1">{user?.email || "No email"}</p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <div>Role: <span className="text-cyan-300 font-semibold ml-1">{user?.role || "-"}</span></div>
                  <div>Joined: <span className="text-emerald-300 font-semibold ml-1">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatarSrc(reader.result);
                        setAvatarZoom(1);
                        setOffsetX(0);
                        setOffsetY(0);
                        setShowAvatarCropper(true);
                      };
                      reader.readAsDataURL(f);
                    };
                    input.click();
                  }}
                  className="px-4 py-2 bg-white/6 border border-white/8 rounded-xl hover:scale-[1.02] transition">
                  Change Avatar
                </button>

                {user?.role === "seller" && (
                  <button onClick={() => navigate("/seller/kyc")} className="px-4 py-2 bg-emerald-600/80 rounded-xl hover:brightness-105 transition">
                    Apply for KYC
                  </button>
                )}
              </div>
            </div>

            {user?.bio && <p className="mt-4 text-gray-300 max-w-2xl">{user.bio}</p>}
          </div>
        </div>

        {/* CONTENT: depends on active tab */}
        {activeTab === "overview" && (
          <>
            {/* Account Info */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-emerald-600 p-2 rounded-md">Account Information</h3>
                <div className="flex gap-2 bg-emerald-600 p-2 rounded-md hover:bg-emerald-800">
                  {contactsMasked ? (
                    <button onClick={() => setShowReauthModal(true)} className="px-3 py-1.5 bg-white/6 rounded-lg">Reveal contacts</button>
                  ) : (
                    <button onClick={() => setContactsMasked(true)} className="px-3 py-1.5 bg-white/6 rounded-lg">Hide contacts</button>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
                <Info label="Full Name" value={user.name || "Not set"} />
                <Info label="Username" value={user.username || "Not set"} />
                <Info label="Email Address" value={contactsMasked ? maskedEmail(user.email) : (user.email || "Not added")} />
                <Info label="Phone Number" value={contactsMasked ? maskedPhone(user.phone) : (user.phone || "Not added")} />
                {(() => {
                  const da = (addresses && addresses.length > 0) ? (addresses.find(a => a.isDefault) || addresses[0]) : null;
                  const addrStr = da ? `${da.line1}${da.line2 ? ", " + da.line2 : ""}, ${da.city}, ${da.state} ${da.postalCode}${da.country ? ", " + da.country : ""}` : (user.address || "Not added");
                  return <Info label="Address" value={addrStr} />;
                })()}
                <Info label="Location" value={user.location || "Not added"} />
                <Info label="Time Zone" value={user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone} />
                <Info label="Twitter" value={user.twitter || "Not linked"} />
                <Info label="Instagram" value={user.instagram || "Not linked"} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard label="Total Bids" value={stats.totalBids} color="cyan" />
              <StatCard label="Auctions Won" value={stats.auctionsWon} color="emerald" />
              <StatCard label="Wallet Balance" value={`₹${stats.wallet}`} color="yellow" />
            </div>

            {/* Edit Profile */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Edit Profile</h3>
                {!editMode && <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-cyan-600 rounded-xl">Edit</button>}
              </div>

              {editMode ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <Input label="Time Zone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
                    <Input label="Twitter" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
                    <Input label="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
                  </div>

                  <div className="mt-4">
                    <label className="text-gray-400 text-sm">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={4}
                      className="w-full mt-1 bg-white/6 border border-white/8 rounded-lg px-4 py-2 outline-none text-white focus:ring-2 focus:ring-cyan-400/20 transition"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={saveProfile} className="px-6 py-3 bg-green-600 rounded-xl">Save</button>
                    <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-3 bg-red-600 rounded-xl">Cancel</button>
                  </div>
                </>
              ) : (
                <p className="text-gray-300">Click Edit to change your profile details.</p>
              )}
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl bg-black/30 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                  <p className="text-sm text-gray-400">Permanently delete your account and all associated data.</p>
                </div>
                <button onClick={() => setShowDeleteModal(true)} className="px-6 py-3 bg-red-600 rounded-xl">Delete Account</button>
              </div>
            </div>

            {/* Change Password */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <h3 className="text-xl font-bold mb-4">Change Password</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Old Password" type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
                <Input label="New Password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
              </div>
              <button onClick={changePassword} className="mt-4 px-6 py-2 bg-yellow-500 rounded-xl">Update Password</button>
            </div>

            {/* Addresses */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Addresses</h3>
                <button onClick={openAddAddress} className="px-4 py-2 bg-cyan-600 rounded-lg">Add Address</button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-gray-400">No addresses added.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/4 border border-white/8">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{a.label || "Address"}</p>
                            {a.isDefault && <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-600/30 border border-emerald-400/30 text-emerald-200">Default</span>}
                          </div>
                          <p className="text-gray-300 mt-1">{a.name}</p>
                          <p className="text-gray-400 text-sm">{a.line1}{a.line2 ? ", " + a.line2 : ""}</p>
                          <p className="text-gray-400 text-sm">{a.city}, {a.state} {a.postalCode}</p>
                          <p className="text-gray-400 text-sm">{a.country}</p>

                          {a.line1 && (
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.line1} ${a.line2 || ""}, ${a.city}, ${a.state} ${a.postalCode}, ${a.country}`)}`}
                              target="_blank" rel="noreferrer"
                              className="inline-block mt-2 text-cyan-300 text-sm hover:underline">
                              View on map
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {!a.isDefault && <button onClick={() => setDefaultAddress(i)} className="px-3 py-1 text-sm bg-white/6 rounded">Make Default</button>}
                          <button onClick={() => openEditAddress(i)} className="px-3 py-1 text-sm bg-white/6 rounded">Edit</button>
                          <button onClick={() => deleteAddress(i)} className="px-3 py-1 text-sm bg-red-600/80 rounded">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2FA */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-gray-400">Protect your account with a one-time code at login.</p>
                </div>
                {twoFactorEnabled ? (
                  <button onClick={disable2FA} className="px-4 py-2 bg-red-600 rounded-lg">Disable</button>
                ) : (
                  <button onClick={requestEnable2FA} className="px-4 py-2 bg-cyan-600 rounded-lg">Enable</button>
                )}
              </div>
            </div>

            {/* Wallet & Payments */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <h3 className="text-xl font-bold mb-4">Wallet & Payments</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-sm text-gray-400">Balance</p>
                  <p className="text-3xl font-bold mt-1">₹{stats.wallet}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-sm text-gray-400">Linked Methods</p>
                  <p className="text-gray-300">Manage cards/UPI in Wallet</p>
                </div>

                <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-sm text-gray-400">Statements</p>
                  <button onClick={downloadOrdersCSV} className="mt-1 px-3 py-1.5 bg-white/6 rounded">Download CSV</button>
                </div>
              </div>

              <div className="mt-4 flex gap-3 flex-wrap">
                <button onClick={() => navigate("/wallet?action=add")} className="px-4 py-2 bg-cyan-600 rounded-lg">Add Funds</button>
                <button onClick={() => navigate("/wallet?action=withdraw")} className="px-4 py-2 bg-purple-600 rounded-lg">Withdraw</button>
                <button onClick={() => navigate("/wallet")} className="px-4 py-2 bg-blue-600 rounded-lg">Go to Wallet</button>
              </div>
            </div>

            {/* Tax Details */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <h3 className="text-xl font-bold mb-4">Tax Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
                <Input label="PAN Number" value={form.panNumber} onChange={(e) => setForm({ ...form, panNumber: e.target.value })} />
              </div>
              <button onClick={saveProfile} className="mt-4 px-6 py-2 bg-green-600 rounded-xl">Save Tax Details</button>
            </div>

            {/* Purchased Items */}
            <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
              <h3 className="text-xl font-bold mb-4">Purchased Items</h3>
              {orders.length === 0 ? (
                <p className="text-gray-400">No purchases yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o, i) => (
                    <div key={i} className="space-y-2">
                      <OrderCard order={o} />
                      <div className="flex gap-2">
                        <button onClick={() => downloadInvoice(o._id)} className="px-3 py-1.5 bg-white/6 rounded">Invoice PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* BUYER TAB */}
        {activeTab === "buyer" && (
          <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
            <h3 className="text-xl font-bold mb-4">Buyer Tools</h3>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate("/wishlist")} className="px-4 py-2 bg-cyan-600 rounded-lg">Watchlist</button>
              <button onClick={() => toast("Saved searches coming soon")} className="px-4 py-2 bg-white/6 rounded-lg">Saved Searches</button>
              <button onClick={() => toast("Alerts coming soon")} className="px-4 py-2 bg-white/6 rounded-lg">Alerts</button>
            </div>
          </div>
        )}

        {/* SELLER TAB */}
        {activeTab === "seller" && user?.role === "seller" && (
          <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
            <h3 className="text-xl font-bold mb-4">Seller Tools</h3>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate("/seller/settings")} className="px-4 py-2 bg-cyan-600 rounded-lg">Storefront Settings</button>
              <button onClick={() => navigate("/seller/settings?tab=policy")} className="px-4 py-2 bg-white/6 rounded-lg">Return Policy</button>
              <button onClick={() => navigate("/seller/settings?tab=shipping")} className="px-4 py-2 bg-white/6 rounded-lg">Shipping Profiles</button>
              <button onClick={() => navigate("/seller/settings?tab=bio")} className="px-4 py-2 bg-white/6 rounded-lg">Seller Bio</button>
            </div>

            {/* My Auctions */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">My Auctions</h4>
              {myAuctions.length === 0 ? (
                <p className="text-gray-400">You haven't listed any auctions yet.</p>
              ) : (
                <div className="space-y-3">
                  {myAuctions.map((a, i) => <AuctionCard key={i} auction={a} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Won auctions (global) */}
        <div className="p-6 rounded-2xl bg-black/30 border border-white/6">
          <h3 className="text-xl font-bold mb-4">Auctions Won</h3>
          {wonAuctions.filter((a) => a.status !== "bought").length === 0 ? (
            <p className="text-gray-400">You haven't won any auctions yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {wonAuctions.filter((a) => a.status !== "bought").map((a) => (
                <motion.div key={a._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/5 border border-cyan-500/20 hover:bg-white/6 transition">
                  <img src={a.image} alt={a.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                  <p className="font-bold text-cyan-300">{a.title}</p>
                  <p className="text-gray-300 mt-1">Final Price: ₹{a.currentPrice}</p>
                  <p className="text-xs mt-1 opacity-80">{a.status === "bought" ? "Purchased" : "Won"}</p>
                  <p className="text-gray-400 text-sm">Seller: {a.sellerId?.name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DELETE ACCOUNT MODAL */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-4 w-[min(640px,100vw)]">
          <h3 className="text-2xl font-bold mb-2">Are you sure?</h3>
          <p className="text-gray-300 mb-6">This action cannot be undone. This will permanently delete your account.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteModal(false)} disabled={deleting} className="px-5 py-2 rounded-lg bg-white/6">Cancel</button>
            <button onClick={deleteAccount} disabled={deleting} className="px-5 py-2 rounded-lg bg-red-600">{deleting ? "Deleting..." : "Delete"}</button>
          </div>
        </div>
      </Modal>

      {/* REAUTH MODAL */}
      <Modal open={showReauthModal} onClose={() => setShowReauthModal(false)}>
        <div className="p-4 w-[min(480px,100vw)]">
          <h3 className="text-2xl font-bold mb-2">Confirm your password</h3>
          <p className="text-gray-300 mb-4">For your security, please re-enter your password to reveal contact info.</p>
          <div className="grid gap-3">
            <Input label="Password" type="password" value={reauthPassword} onChange={(e) => setReauthPassword(e.target.value)} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReauthModal(false)} className="px-5 py-2 rounded-lg bg-white/6">Cancel</button>
              <button onClick={reauthenticateAndReveal} className="px-5 py-2 rounded-lg bg-blue-600">Confirm</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 2FA MODAL */}
      <Modal open={show2FAModal} onClose={() => setShow2FAModal(false)}>
        <div className="p-4 w-[min(480px,100vw)]">
          <h3 className="text-2xl font-bold mb-2">Enter OTP</h3>
          <p className="text-gray-300 mb-4">We sent a one-time code to your registered email/phone.</p>
          <div className="grid gap-3">
            <Input label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{otpCooldown > 0 ? `Resend available in ${otpCooldown}s` : `Didn't receive it?`}</span>
              <button
                onClick={requestEnable2FA}
                disabled={otpCooldown > 0}
                className={`px-3 py-1.5 rounded ${otpCooldown > 0 ? 'bg-white/10 cursor-not-allowed' : 'bg-white/6'}`}
              >
                Resend code
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShow2FAModal(false)} className="px-5 py-2 rounded-lg bg-white/6">Cancel</button>
              <button onClick={confirmEnable2FA} className="px-5 py-2 rounded-lg bg-blue-600">Confirm</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ADDRESS MODAL */}
      <Modal open={showAddrModal} onClose={() => setShowAddrModal(false)}>
        <div className="p-4 w-[min(480px,100vw)] max-h-[80vh] overflow-y-auto no-scrollbar">
          <h3 className="text-xl font-bold mb-3">{editingIndex >= 0 ? "Edit Address" : "Add Address"}</h3>
          <div className="grid gap-3">
            <Input label="Label" value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} />
            <Input label="Full Name" value={addrForm.name} onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })} />
            <Input label="Address Line 1" value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} />
            <Input label="Address Line 2" value={addrForm.line2} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })} />
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="City" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
              <Input label="State/Province" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="PIN/Postal Code"
                value={addrForm.postalCode}
                onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                onBlur={() => {
                  if (!addrForm.country) {
                    const c = validatePostalCountry(addrForm.postalCode);
                    if (c) setAddrForm((f) => ({ ...f, country: c }));
                  }
                }}
              />
              <Input label="Country" value={addrForm.country} onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })} />
            </div>
            <Input label="Phone" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
              Set as default
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowAddrModal(false)} className="px-4 py-2 bg-white/6 rounded-lg">Cancel</button>
            <button onClick={async () => { await saveAddressFromModal(); }} className="px-4 py-2 bg-green-600 rounded-lg">Save</button>
          </div>
        </div>
      </Modal>

      {/* AVATAR CROPPER */}
      <Modal open={showAvatarCropper} onClose={() => setShowAvatarCropper(false)}>
        <div className="p-4 w-[min(480px,100vw)] max-h-[85vh] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-4">Crop Avatar</h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative bg-black/40 border border-white/8 rounded-xl p-3">
              <div
                className="relative w-[260px] h-[260px] overflow-hidden rounded-lg bg-black/30 touch-none"
                onPointerDown={(e) => {
                  dragRef.current.dragging = true;
                  dragRef.current.startX = e.clientX;
                  dragRef.current.startY = e.clientY;
                  dragRef.current.baseX = offsetX;
                  dragRef.current.baseY = offsetY;
                  try { e.currentTarget.setPointerCapture(e.pointerId); } catch { }
                }}
                onPointerMove={(e) => {
                  if (!dragRef.current.dragging) return;
                  const dx = e.clientX - dragRef.current.startX;
                  const dy = e.clientY - dragRef.current.startY;
                  setOffsetX(dragRef.current.baseX + dx);
                  setOffsetY(dragRef.current.baseY + dy);
                }}
                onPointerUp={(e) => {
                  dragRef.current.dragging = false;
                  try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { }
                }}
                onPointerLeave={() => { dragRef.current.dragging = false; }}
              >
                {avatarSrc && (
                  <img
                    src={avatarSrc}
                    alt="Avatar to crop"
                    className="absolute top-1/2 left-1/2 select-none"
                    style={{
                      transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${avatarZoom})`
                    }}
                    draggable={false}
                  />
                )}

                <div className="pointer-events-none absolute inset-0 ring-2 ring-cyan-400/70 rounded-lg" />
              </div>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-sm mb-2">Zoom</label>
              <input type="range" min="1" max="3" step="0.01" value={avatarZoom} onChange={(e) => setAvatarZoom(parseFloat(e.target.value))} className="w-full" />
              <p className="text-xs text-gray-400 mt-1">Center square crop. Use zoom to adjust area.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowAvatarCropper(false)} className="px-5 py-2 rounded-lg bg-white/6" disabled={uploadingAvatar}>Cancel</button>
            <button onClick={handleSaveAvatar} className="px-5 py-2 rounded-lg bg-blue-600" disabled={uploadingAvatar}>{uploadingAvatar ? "Saving..." : "Save Avatar"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------- Small subcomponents ----------------- */

function Tab({ name, label, activeTab, setActiveTab }) {
  const active = activeTab === name;
  return (
    <button onClick={() => setActiveTab(name)} className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition ${active ? "bg-cyan-500/20 border border-cyan-400 shadow-[0_6px_30px_rgba(0,200,255,0.06)]" : "bg-white/4 border border-white/8 hover:bg-white/6"}`}>
      {label}
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function StatCard({ label, value, color = "cyan" }) {
  const colorClass = {
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    yellow: "text-yellow-300",
  }[color] || "text-cyan-300";

  return (
    <div className="p-6 rounded-xl bg-white/4 border border-white/8 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-400 text-sm">{label}</label>
      <input {...props} className="bg-white/6 border border-white/8 rounded-lg px-2 py-2 outline-none text-black focus:ring-2 focus:ring-cyan-400/20 transition" />
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl bg-white/4 border border-white/8">
      <p className="font-semibold">Auction: {order.auctionId?.title}</p>
      <p className="text-gray-300 text-sm">Amount: ₹{order.amount}</p>
      <p className="text-gray-400 text-xs">Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</p>
    </motion.div>
  );
}

function AuctionCard({ auction }) {
  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl bg-white/4 border border-white/8">
      <p className="font-semibold">{auction.title}</p>
      <p className="text-gray-300 text-sm">Status: {auction.status}</p>
      <p className="text-gray-400 text-xs">Ends: {auction.endTime ? new Date(auction.endTime).toLocaleString() : "-"}</p>
    </motion.div>
  );
}

export default Profile;
