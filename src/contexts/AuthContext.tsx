'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
<<<<<<< HEAD

interface AuthContextType {
  user: any | null;
=======
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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
<<<<<<< HEAD
  const [user, setUser] = useState<any | null>(null);
=======
  const [user, setUser] = useState<User | null>(null);
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    const checkAuth = () => {
      const isUnlocked = sessionStorage.getItem('admin_unlocked') === 'true';
      if (isUnlocked) {
        setUser({ email: 'admin@robo-advisor.kr' });
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (optional, but good for multi-tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
=======
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user is admin
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === 'admin');
          } else {
            // Bootstrap admin if it's the default email
            if (currentUser.email === 'luganopizza@gmail.com') {
              await setDoc(userDocRef, {
                email: currentUser.email,
                role: 'admin',
                createdAt: serverTimestamp(),
              });
              setIsAdmin(true);
            } else {
              // Create regular user
              await setDoc(userDocRef, {
                email: currentUser.email,
                role: 'user',
                createdAt: serverTimestamp(),
              });
              setIsAdmin(false);
            }
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
