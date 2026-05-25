'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      let adminByRole = false;

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        adminByRole = userDoc.exists() && userDoc.data().role === 'admin';
      } catch (error) {
        console.error('Error checking admin role:', error);
      }

      const adminByEmail = firebaseUser.emailVerified && firebaseUser.email === 'luganopizza@gmail.com';

      setUser(firebaseUser);
      console.log("ADMIN UID", firebaseUser?.uid);
      console.log("ADMIN EMAIL", firebaseUser?.email);
      console.log("ADMIN VERIFIED", firebaseUser?.emailVerified);
      setIsAdmin(adminByRole || adminByEmail);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
