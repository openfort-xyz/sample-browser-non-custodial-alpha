import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { authService } from "../services/authService";
import { User } from "firebase/auth";
import { useOpenfort } from "../hooks/useOpenfort";

interface AuthContextType {
  user: User | null;
  idToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  idToken: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const { authenticateWithOpenfort } = useOpenfort();

  useEffect(() => {
    return authService.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        setIdToken(null);
        return;
      }
      const token = await user.getIdToken();
      setUser(user);
      setIdToken(token);
      await authenticateWithOpenfort(token);
    });
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);
      if (user) {
        const token = await user.getIdToken(true);
        setIdToken(token);
        await authenticateWithOpenfort(token);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, idToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
