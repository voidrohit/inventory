import { createContext, useContext, useEffect, useState } from "react";

import { fetchCurrentUser, login as loginRequest } from "../api/auth";
import { clearToken, getToken, setToken } from "../lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setInitializing(false);
        return;
      }
      try {
        setUser(await fetchCurrentUser());
      } catch {
        clearToken();
      } finally {
        setInitializing(false);
      }
    }
    restoreSession();
  }, []);

  async function login(credentials) {
    const { access_token } = await loginRequest(credentials);
    setToken(access_token);
    setUser(await fetchCurrentUser());
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
