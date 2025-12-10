import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminLayout from "../components/admin/AdminLayout";

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  // test notification UI state
  const [showTest, setShowTest] = useState(false);
  const [testUserId, setTestUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [testMessage, setTestMessage] = useState("Test notification from admin");
  const [testLink, setTestLink] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (auth?.role !== "admin") return;
    let mounted = true;
    setLoadingUsers(true);
    api
      .get("/admin/users")
      .then((res) => {
        if (!mounted) return;
        setUsers(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load users for admin test UI:", err);
        toast.error("Failed to load users");
      })
      .finally(() => {
        if (mounted) setLoadingUsers(false);
      });

    return () => {
      mounted = false;
    };
  }, [auth]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  async function clearAllNotifications() {
    try {
      await api.delete("/notifications/clear");
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  }

  if (loading) return <p className="text-white p-10">Loading notifications...</p>;

  return (
    <AdminLayout>
      <div className="pt-28 px-8 pb-20 max-w-5xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Notifications
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Clear All
            </button>
          )}

          {/* Admin test notification control */}
          {auth?.role === "admin" && (
            <div className="w-full max-w-sm">
              <button
                onClick={() => setShowTest((s) => !s)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium"
              >
                {showTest ? "Close Test" : "Send Test"}
              </button>

              {showTest && (
                <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded">
                  <label className="text-xs text-gray-300">Target User</label>
                  {loadingUsers ? (
                    <div className="text-sm text-gray-400 py-2">Loading users...</div>
                  ) : (
                    <select
                      value={manualEntry ? "manual" : testUserId}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "manual") {
                          setManualEntry(true);
                          setTestUserId("");
                        } else {
                          setManualEntry(false);
                          setTestUserId(v);
                        }
                      }}
                      className="w-full mt-1 mb-2 px-3 py-2 rounded bg-black/40 text-white"
                    >
                      <option value="">-- select user --</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} &lt;{u.email}&gt;
                        </option>
                      ))}
                      <option value="manual">Enter userId manually</option>
                    </select>
                  )}

                  {manualEntry && (
                    <input
                      value={testUserId}
                      onChange={(e) => setTestUserId(e.target.value)}
                      placeholder="paste userId here"
                      className="w-full mt-1 mb-2 px-3 py-2 rounded bg-black/40 text-white"
                    />
                  )}

                  <label className="text-xs text-gray-300">Message</label>
                  <input
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Notification message"
                    className="w-full mt-1 mb-2 px-3 py-2 rounded bg-black/40 text-white"
                  />

                  <label className="text-xs text-gray-300">Link (optional)</label>
                  <input
                    value={testLink}
                    onChange={(e) => setTestLink(e.target.value)}
                    placeholder="/auction/123"
                    className="w-full mt-1 mb-3 px-3 py-2 rounded bg-black/40 text-white"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!testUserId || !testMessage) {
                          toast.error("Provide userId and message");
                          return;
                        }
                        try {
                          setSending(true);
                          const res = await api.post("/admin/notify-test", {
                            userId: testUserId,
                            message: testMessage,
                            link: testLink || undefined,
                          });
                          toast.success(res.data?.message || "Notification sent");
                          setTestUserId("");
                          setTestMessage("Test notification from admin");
                          setTestLink("");
                          setShowTest(false);
                        } catch (err) {
                          console.error(err);
                          toast.error(err.response?.data?.message || "Failed to send test notification");
                        } finally {
                          setSending(false);
                        }
                      }}
                      disabled={sending}
                      className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-medium"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>

                    <button
                      onClick={() => { setShowTest(false); }}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
            >
              <p className="font-semibold text-blue-300">{notif.type}</p>
              <p className="text-gray-300 mt-1">{notif.message}</p>
              {notif.createdAt && (
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
