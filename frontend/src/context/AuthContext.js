import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // read stored userInfo (may include userId)
  const stored = JSON.parse(localStorage.getItem("userInfo")) || { token: null, role: null, userId: null };
  const [auth, setAuth] = useState(stored);

  const login = (token, role, userId = null) => {
    const userInfo = { token, role, userId };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    if (userId) localStorage.setItem("userId", userId);
    setAuth(userInfo);
    try { window.dispatchEvent(new Event('userIdChanged')); } catch (e) {}
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    setAuth({ token: null, role: null, userId: null });
    try { window.dispatchEvent(new Event('userIdChanged')); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
