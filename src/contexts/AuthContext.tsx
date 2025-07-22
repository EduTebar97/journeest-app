
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as authService from '../services/authService';
import { UserProfile } from '../types';

// Define the shape of the data needed for registration
interface RegistrationData {
    email: string;
    password: string;
    companyData: { name: string; brand: string; type: string; };
    adminProfile: { name: string; position: string; phone?: string; };
    initialObjectives: string[];
}

export interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  registerAndCreateCompany: (data: RegistrationData) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Subscribing to auth state changes.');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      console.log('[AuthContext] onAuthStateChanged triggered.');
      try {
        if (firebaseUser) {
          console.log(`[AuthContext] Firebase user detected with UID: ${firebaseUser.uid}. Fetching profile...`);
          const userProfile = await authService.getUserProfile(firebaseUser.uid);
          
          if (userProfile) {
            console.log('[AuthContext] User profile found:', userProfile);
            setCurrentUser(userProfile);
          } else {
            console.log('[AuthContext] No user profile found for the given UID. Setting user to null.');
            setCurrentUser(null);
          }
        } else {
          console.log('[AuthContext] No Firebase user detected. User is logged out.');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("[AuthContext] Error during auth state change:", error);
        setCurrentUser(null);
      } finally {
        console.log('[AuthContext] Finished auth state change processing. Setting loading to false.');
        setLoading(false);
      }
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from auth state changes.');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    console.log(`[AuthContext] Attempting login for ${email}`);
    const user = await authService.signIn(email, password);
    setCurrentUser(user);
    return user;
  };

  const registerAndCreateCompany = async (data: RegistrationData): Promise<UserProfile> => {
    console.log(`[AuthContext] Attempting registration for ${data.email}`);
    const userProfile = await authService.registerAndCreateCompany(data);
    setCurrentUser(userProfile);
    return userProfile;
  };

  const logout = async (): Promise<void> => {
    console.log('[AuthContext] Logging out user.');
    await authService.logOut();
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    registerAndCreateCompany,
    logout,
  };

  console.log(`[AuthContext] Rendering AuthProvider. Loading: ${loading}, CurrentUser:`, currentUser);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
