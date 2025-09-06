import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase-config";

type AuthContextType = {
  googleSignIn: () => Promise<void>;
  googleSignOut: () => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  googleSignIn: async () => {},
  googleSignOut: async () => {},
  user: null,
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const googleSignOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unSubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, googleSignOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);