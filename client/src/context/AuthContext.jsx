import { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "@/api/services/auth";
import { fetchCurrentUser } from "@/api/services/me";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const me = await fetchCurrentUser();
          setUser(me);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async ({ email, password }) => {
    const data = await loginService({ email, password });

    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);

    const me = await fetchCurrentUser();
    setUser(me);

    return me;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
