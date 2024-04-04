import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/authService";
import Spinner from "../components/Shared/Spinner";
import { User } from "firebase/auth";

// Define the shape of the context
interface AuthContextType {
  user: User | null; // Define a more specific type for your user
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the AuthContext itself for useContext hook in components
export { AuthContext };

// Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logic to handle state changes and authentication methods

  useEffect(() => {
    // Example: Setup an auth state change listener
    const unsubscribe = authService.onAuthStateChanged((newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      // Handle successful sign-in
    } catch (error) {
      // Handle sign-in error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const register = async (email: string, password: string) => {
    await authService.signUp(email, password);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithGoogle, logout, login, register }}
    >
      {!isLoading ? children : <Spinner />}
    </AuthContext.Provider>
  );
};
