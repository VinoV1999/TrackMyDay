import { useContext, createContext, useState } from "react";
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [ user, setUser ] = useState();
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    }
    const googlesignOut = () => {
        signOut(auth);
    }
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
        });
        return()=>{
            unSubscribe();
        }
    },[]);
    return (
        <AuthContext.Provider value={{ googleSignIn, googlesignOut, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
}