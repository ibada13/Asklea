import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { login, getUser } from "./auth/utils";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT" | string;
};

type AuthContext = {
  authToken: string | null;
  role: string | null;
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<any>;
  handleLogout: () => void;
  handleGetUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
      handleGetUser();
    }
  }, []);

  async function handleLogin(email: string, password: string) {
    try {
      const res = await login(email, password);
      if (res?.token) {
        setAuthToken(res.token);
        setRole(res.role);
        setUser(res.user || null);
        localStorage.setItem("token", res.token);
      }
      return res;
    } catch (err) {
      setAuthToken(null);
      setRole(null);
      setUser(null);
      throw err;
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setAuthToken(null);
    setRole(null);
    setUser(null);
  }

  async function handleGetUser() {
    try {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setRole(userData.role);
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  }

  return (
    <AuthContext.Provider
      value={{ authToken, role, user, handleLogin, handleLogout, handleGetUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("UseAuth must be used inside an AuthProvider");
  return context;
}
