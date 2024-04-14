import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { useOpenfort } from './useOpenfort';
export const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const {authenticateWithOpenfort, logout:signOut} = useOpenfort();

  // Listen for changes to the authentication state (login, logout)
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      user?.getIdToken().then((token) => setIdToken(token));
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await authService.signIn(email, password);
      const idToken = await userCredential.user.getIdToken();
      authenticateWithOpenfort(idToken);
      setUser(userCredential.user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await authService.signInWithGoogle();
      const idToken = await userCredential.user.getIdToken();
      authenticateWithOpenfort(idToken);
      setUser(userCredential.user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await authService.signUp(email, password);
      const idToken = await userCredential.user.getIdToken();
      authenticateWithOpenfort(idToken);
      setUser(userCredential.user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    await authService.logout();
    await signOut();
    setUser(null);
    setIdToken(null);
  };

  return { user, idToken, signIn, signUp, signInWithGoogle, logout, loading };
};
