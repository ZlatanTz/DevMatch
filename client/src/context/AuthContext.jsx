import { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "@/api/services/auth";
import { fetchCurrentUser } from "@/api/services/me";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      fetchCurrentUser()
        .then(setUser)
        .catch(() => {
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  const login = async ({ email, password }) => {
    const data = await loginService({ email, password });

    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);

    const me = await fetchCurrentUser();
    setUser(me);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
