import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { disconnectSocket } from "../lib/socket";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrateUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setCurrentUser(response.data.user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrateUser();
  }, [token]);

  function storeSession(sessionToken, user) {
    localStorage.setItem("token", sessionToken);
    setToken(sessionToken);
    setCurrentUser(user);
  }

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    storeSession(response.data.token, response.data.user);
    return response.data.user;
  }

  async function signup(name, email, password) {
    const response = await api.post("/auth/signup", { name, email, password });
    storeSession(response.data.token, response.data.user);
    return response.data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    disconnectSocket();
    setToken(null);
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
