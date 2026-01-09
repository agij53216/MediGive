import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'donor' | 'ngo' | 'admin'
    const [loading, setLoading] = useState(true);

    // Login Function
    async function loginWithGoogle(selectedRole = 'donor') {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            // Demo Mode: Always update role to match the login selection
            // This allows the same Google account to be used for Donor, NGO, and Admin testing
            await setDoc(userDocRef, {
                name: user.displayName,
                email: user.email,
                role: selectedRole,
                lastLogin: new Date()
            }, { merge: true });

            setUserRole(selectedRole);
            return user;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    }

    // Logout Function
    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        let unsubscribeDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            // Clean up previous doc listener if user changed or logged out
            if (unsubscribeDoc) {
                unsubscribeDoc();
                unsubscribeDoc = null;
            }

            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                // Real-time listener ensures we catch the role update from loginWithGoogle immediately
                unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        // Only update if role actually changed or is new
                        setUserRole(data.role);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user role:", error);
                    setLoading(false);
                });
            } else {
                setUserRole(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const value = {
        currentUser,
        userRole,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-bold text-xl">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading Medi-Give...
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
