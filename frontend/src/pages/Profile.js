import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import io from "socket.io-client";

export default function Profile() {
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

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
  const [offsetX, setOffsetX] = useState(0); // px in preview space
  const [offsetY, setOffsetY] = useState(0);
  const dragRef = useState({ dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0 })[0];

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchMyAuctions();
    fetchWonAuctions();
    fetchStats();
    const s = io("http://localhost:4000");
    try {
      const userId = localStorage.getItem("userId");
      if (userId) s.emit("registerUser", userId);
    } catch (e) {}
    const refresh = () => {
      fetchWonAuctions();
      fetchOrders();
    };
    s.on("auctionEnded", refresh);
    s.on("purchaseCompleted", refresh);
    return () => {
      s.off("auctionEnded", refresh);
      s.off("purchaseCompleted", refresh);
      s.close();
    };
  }, []);

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
      });
    } catch {
      toast.error("Failed to load profile");
    }
  }

  async function fetchOrders() {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {}
  }

  async function fetchMyAuctions() {
    try {
      const res = await api.get("/seller/my-auctions");
      setMyAuctions(res.data);
    } catch {}
  }

  async function fetchWonAuctions() {
    try {
      const res = await api.get("/auctions/user/won");
      setWonAuctions(res.data || []);
    } catch {}
  }

  async function fetchStats() {
    try {
      const res = await api.get("/auth/stats");
      setStats(res.data);
    } catch {}
  }

  async function saveProfile() {
    try {
      await api.put("/auth/update", form);
      toast.success("Profile updated");
      setEditMode(false);
      fetchProfile();
    } catch {
      toast.error("Update failed");
    }
  }

  async function changePassword() {
    try {
      await api.put("/auth/change-password", passwords);
      toast.success("Password changed");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      toast.error("Password change failed");
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
      } catch (e) {}
      navigate("/login");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="relative min-h-screen pt-32 px-6 max-w-6xl mx-auto text-white overflow-hidden">

      {/* ===== BACKGROUND: CYBERPUNK × ARCANE ===== */}
      <div className="absolute inset-0 bg-[url('https://th.bing.com/th/id/OIP.tgh660d6GOZAiPP6clX9-QHaEK?w=327&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1')]
                    bg-cover bg-center opacity-[0.15] mix-blend-screen" />

      {/* Mystic Fog */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_20%_20%,rgba(160,70,255,0.45),transparent_65%),
            radial-gradient(circle_at_80%_80%,rgba(0,200,255,0.38),transparent_65%)]
        opacity-40" />

      {/* Cyber Rain */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[90px] bg-cyan-300/20 blur-[1px]"
          initial={{ x: Math.random() * 2000, y: -200 }}
          animate={{ y: "1800px" }}
          transition={{ repeat: Infinity, duration: Math.random() * 1 + 0.6 }}
        />
      ))}

      {/* Rotating Arcane Spell Circle */}
      <motion.img
        src="https://th.bing.com/th/id/OIP.vI0cUZocC3Q7l9c8HKoWjwHaJR?w=146&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"
        className="absolute top-20 left-1/2 w-[900px] -translate-x-1/2 opacity-[0.1]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* PAGE TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-5xl font-extrabold mb-8 
                   bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400
                   text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]"
      >
        My Profile
      </motion.h1>

      {/* PROFILE CARD */}
      <div className="relative z-10 p-10 rounded-3xl bg-white/10 backdrop-blur-2xl 
                      border border-purple-500/20 shadow-[0_0_45px_rgba(160,0,255,0.35)] space-y-12">

        {/* USER HEADER */}
        <div className="flex items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-xl"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.[0]}</span>
            )}
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {user?.name}
              {user?.role === 'seller' && user?.kycVerified && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-600/30 border border-emerald-400/40 text-emerald-200">Verified</span>
              )}
            </h2>
            <p className="text-gray-300">{user?.email}</p>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-gray-400">
                Role:
                <span className="text-cyan-300 font-semibold"> {user?.role}</span>
              </span>
              <span className="text-gray-400">
                Joined:
                <span className="text-emerald-300 font-semibold">
                  {" "}{new Date(user.createdAt).toLocaleDateString()||Date.now()}
                </span>
              </span>
            </div>
            <div className="mt-3 flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAvatarSrc(reader.result);
                      setAvatarZoom(1);
                      setShowAvatarCropper(true);
                    };
                    reader.readAsDataURL(f);
                  };
                  input.click();
                }}
                className="px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded-lg hover:bg-white/20"
              >
                Change Avatar
              </button>
              {user?.role === 'seller' && (
                <button
                  onClick={() => navigate('/seller/kyc')}
                  className="px-3 py-1.5 text-sm bg-emerald-600/80 rounded-lg hover:bg-emerald-600 transition"
                >
                  Apply for KYC
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="p-6 rounded-2xl bg-black/20 border border-white/10">
          <h3 className="text-xl font-bold mb-6">Account Information</h3>

          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <Info label="Full Name" value={user.name} />
            <Info label="Email Address" value={user.email} />
            <Info label="Phone Number" value={user.phone || "Not added"} />
            <Info label="Address" value={user.address || "Not added"} />
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <StatCard label="Total Bids" value={stats.totalBids} color="cyan" />
          <StatCard label="Auctions Won" value={stats.auctionsWon} color="emerald" />
          <StatCard label="Wallet Balance" value={`₹${stats.wallet}`} color="yellow" />
        </div>

        {/* EDIT PROFILE */}
        <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Profile</h3>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-cyan-500/80 rounded-lg hover:bg-cyan-500 transition"
              >
                Edit
              </button>
            )}
          </div>

          {editMode && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={saveProfile} className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700">Save</button>
                <button onClick={() => setEditMode(false)} className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700">Cancel</button>
              </div>
            </>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-black/30 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
              <p className="text-sm text-gray-400">Permanently delete your account and all associated data.</p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
          <h3 className="text-xl font-bold mb-4">Change Password</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Old Password" type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
            <Input label="New Password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          </div>

          <button
            onClick={changePassword}
            className="mt-4 px-6 py-2 bg-yellow-500 rounded-xl hover:bg-yellow-600"
          >
            Update Password
          </button>
        </div>

        {/* PURCHASED ITEMS */}
        <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
          <h3 className="text-xl font-bold mb-4">Purchased Items</h3>

          {orders.length === 0 ? (
            <p className="text-gray-400">No purchases yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o, i) => (
                <OrderCard key={i} order={o} />
              ))}
            </div>
          )}
        </div>

        {/* SELLER AUCTIONS */}
        {user?.role === "seller" && (
          <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
            <h3 className="text-xl font-bold mb-4">My Auctions</h3>

            {myAuctions.length === 0 ? (
              <p className="text-gray-400">You haven't listed any auctions yet.</p>
            ) : (
              <div className="space-y-3">
                {myAuctions.map((a, i) => (
                  <AuctionCard key={i} auction={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* WON AUCTIONS */}
        <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
          <h3 className="text-xl font-bold mb-4">Auctions Won</h3>

          {wonAuctions.filter((a) => a.status !== "bought").length === 0 ? (
            <p className="text-gray-400">You haven't won any auctions yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {wonAuctions.filter((a) => a.status !== "bought").map((a) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-cyan-500/30 hover:bg-white/10 transition"
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
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

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h3 className="text-2xl font-bold mb-2">Are you sure?</h3>
        <p className="text-gray-300 mb-6">This action cannot be undone. This will permanently delete your account.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={deleteAccount}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>

      <Modal open={showAvatarCropper} onClose={() => setShowAvatarCropper(false)}>
        <h3 className="text-2xl font-bold mb-4">Crop Avatar</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative bg-black/40 border border-white/10 rounded-xl p-3">
            <div
              className="relative w-[260px] h-[260px] overflow-hidden rounded-lg bg-black/30 touch-none"
              onPointerDown={(e) => {
                dragRef.dragging = true;
                dragRef.startX = e.clientX;
                dragRef.startY = e.clientY;
                dragRef.baseX = offsetX;
                dragRef.baseY = offsetY;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!dragRef.dragging) return;
                const dx = e.clientX - dragRef.startX;
                const dy = e.clientY - dragRef.startY;
                setOffsetX(dragRef.baseX + dx);
                setOffsetY(dragRef.baseY + dy);
              }}
              onPointerUp={(e) => {
                dragRef.dragging = false;
                try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
              }}
              onPointerLeave={() => { dragRef.dragging = false; }}
            >
              {avatarSrc && (
                <img
                  src={avatarSrc}
                  alt="Avatar to crop"
                  className="absolute top-1/2 left-1/2 select-none"
                  style={{ transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${avatarZoom})` }}
                  draggable={false}
                />
              )}
              <div className="pointer-events-none absolute inset-0 ring-2 ring-cyan-400/70 rounded-lg" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm mb-2">Zoom</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={avatarZoom}
              onChange={(e) => setAvatarZoom(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">Center square crop. Use zoom to adjust area.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setShowAvatarCropper(false)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20" disabled={uploadingAvatar}>Cancel</button>
          <button
            onClick={async () => {
              try {
                if (!avatarSrc) return setShowAvatarCropper(false);
                setUploadingAvatar(true);
                const img = new Image();
                img.src = avatarSrc;
                await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
                const ow = img.naturalWidth || img.width;
                const oh = img.naturalHeight || img.height;
                // Convert preview offsets to source pixel offsets (divide by zoom scale ratio between preview and source)
                // Preview shows image at scale avatarZoom centered; offsetX/Y are applied in preview pixels.
                // Map preview px to source px by dividing by avatarZoom.
                const size = Math.floor(Math.min(ow, oh) / avatarZoom);
                let sx = Math.floor((ow - size) / 2 + (offsetX / avatarZoom));
                let sy = Math.floor((oh - size) / 2 + (offsetY / avatarZoom));
                // Clamp within image bounds
                sx = Math.max(0, Math.min(ow - size, sx));
                sy = Math.max(0, Math.min(oh - size, sy));
                const canvas = document.createElement('canvas');
                const out = 400;
                canvas.width = out; canvas.height = out;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, sx, sy, size, size, 0, 0, out, out);
                let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                if (!blob) {
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                  const byteString = atob(dataUrl.split(',')[1]);
                  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                  const ab = new ArrayBuffer(byteString.length);
                  const ia = new Uint8Array(ab);
                  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                  blob = new Blob([ab], { type: mimeString });
                }
                const file = new File([blob], `avatar_${Date.now()}.jpg`, { type: 'image/jpeg' });
                const fd = new FormData();
                fd.append('avatar', file);
                const res = await api.post('/auth/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                setUser(res.data);
                toast.success('Avatar updated');
              } catch (e) {
                toast.error(e?.response?.data?.message || 'Failed to update avatar');
              } finally {
                setUploadingAvatar(false);
                setShowAvatarCropper(false);
              }
            }}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? 'Saving...' : 'Save Avatar'}
          </button>
        </div>
      </Modal>
    </div>
  );
}



/* ───────────────────── COMPONENTS ───────────────────── */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(150,0,255,0.15)]">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 text-${color}-400`}>{value}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-400 text-sm">{label}</label>

      <input
        {...props}
        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 outline-none text-white 
                   focus:border-cyan-400 focus:bg-white/20 transition"
      />
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
    >
      <p className="font-semibold">Auction: {order.auctionId?.title}</p>
      <p className="text-gray-300 text-sm">Amount: ₹{order.amount}</p>
      <p className="text-gray-400 text-xs">Date: {new Date(order.createdAt).toLocaleString()}</p>
    </motion.div>
  );
}

function AuctionCard({ auction }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
    >
      <p className="font-semibold">{auction.title}</p>
      <p className="text-gray-300 text-sm">Status: {auction.status}</p>
      <p className="text-gray-400 text-xs">Ends: {new Date(auction.endTime).toLocaleString()}</p>
    </motion.div>
  );
}
