import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Automatically check for token & user on app load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", userData.username);
    setUser({ token, username: userData.username });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
