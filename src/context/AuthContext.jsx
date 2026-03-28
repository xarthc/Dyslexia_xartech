import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_profile");
    return savedUser ? JSON.parse(savedUser) : { isPro: false, name: "Guest", lang: "en" };
  });

  const upgradeToPro = () => {
    const updatedUser = { ...user, isPro: true };
    setUser(updatedUser);
    localStorage.setItem("user_profile", JSON.stringify(updatedUser));
  };

  const setLanguage = (lang) => {
    const updatedUser = { ...user, lang };
    setUser(updatedUser);
    localStorage.setItem("user_profile", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, upgradeToPro, setLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};
