"use client";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

const getAccessTokenSilently = async () => "mock_token_for_tenant123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const loginWithRedirect = async () => {
    setIsAuthenticated(true);
    setUser({ name: "Test User", email: "test@example.com", picture: "https://github.com/identicons/test.png" });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginWithRedirect, logout, user, getAccessTokenSilently }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
