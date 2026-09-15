import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("placement_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile || null);
      }
    } catch (err) {
      console.error("Failed to load authenticated user:", err);
      localStorage.removeItem("placement_token");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("placement_token", res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile || null);
      return res.data;
    }
    throw new Error(res.data.message || "Login failed");
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res.data.success) {
      localStorage.setItem("placement_token", res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile || null);
      return res.data;
    }
    throw new Error(res.data.message || "Registration failed");
  };

  const logout = () => {
    localStorage.removeItem("placement_token");
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = (newProfile) => {
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
