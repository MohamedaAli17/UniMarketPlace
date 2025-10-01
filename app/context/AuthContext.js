import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new user
  const register = async (email, password, name, accountType) => {
    try {
      // Validate email domain
      if (!email.endsWith('@brunel.ac.uk')) {
        throw new Error('Only @brunel.ac.uk email addresses are allowed');
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: email,
        name: name,
        accountType: accountType, // 'buyer' or 'seller'
        createdAt: new Date().toISOString(),
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalSpent: 0,
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userProfile);
      } catch (firestoreError) {
        console.error('Error saving user profile to Firestore:', firestoreError);
        // Continue with registration even if Firestore fails
        console.log('Continuing with local profile only');
      }
      
      setUserProfile(userProfile);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      // Return a default profile if Firestore is unavailable
      return {
        uid: uid,
        email: currentUser?.email || '',
        name: 'User',
        accountType: 'buyer', // Default to buyer if we can't fetch profile
        createdAt: new Date().toISOString(),
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalSpent: 0,
      };
    }
  };

  // Update user profile
  const updateUserProfile = async (uid, updates) => {
    try {
      await setDoc(doc(db, 'users', uid), updates, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      throw error;
    }
  };

  // Refresh user profile from Firestore
  const refreshUserProfile = async (uid) => {
    try {
      const profile = await getUserProfile(uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  // Check if user is a seller
  const isSeller = () => {
    return userProfile?.accountType === 'seller';
  };

  // Check if user is a buyer
  const isBuyer = () => {
    return userProfile?.accountType === 'buyer';
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Set a default profile if we can't load from Firestore
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            name: 'User',
            accountType: 'buyer',
            createdAt: new Date().toISOString(),
            totalSales: 0,
            totalRevenue: 0,
            totalOrders: 0,
            totalSpent: 0,
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    getUserProfile,
    updateUserProfile,
    refreshUserProfile,
    isSeller,
    isBuyer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
