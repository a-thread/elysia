import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { UserService } from "@shared/services/UserService";
import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const session = await UserService.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    // Listen to auth state changes
    const authListener = supabaseWithAbort.request(
      "onAuthStateChange",
      async (client) => {
        return client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
      }
    );

    return () => {
      authListener.then(
        (listener) => listener && listener.data.subscription?.unsubscribe()
      );
    };
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
