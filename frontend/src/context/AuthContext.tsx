import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Shape of user data stored in context
interface User {
  token: string;
  name: string;
  email: string;
}

// Shape of what AuthContext provides
interface AuthContextType {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Wrap entire app with this so all pages can access user info
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists in localStorage (persists refresh)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    if (token && name && email) {
      setUser({ token, name, email });
    }
    setLoading(false);
  }, []);

  // Save token and user info after login
  const login = (data: User) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    setUser(data);
  };

  // Clear everything on logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any page to get user info
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}