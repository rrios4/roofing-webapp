import React from 'react';
import { useContext, useState, useEffect, createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import supabase from '../lib/supabase-client';
import { googleService } from '../services/google-service';

type Props = {
  children: React.ReactNode;
};

export type AuthValueTypes = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  googleLogin: () => Promise<{ error: any }>;
};

// create a context for authentication
const AuthContext = createContext<AuthValueTypes>({ 
  session: null, 
  user: null, 
  signOut: async () => {},
  googleLogin: async () => ({ error: null })
});

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes:
          'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      console.log(error);
    }

    return { error };
  };

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Clear Google service tokens first
      googleService.clearTokens();

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error during sign out:', error);
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const value: AuthValueTypes = {
    session,
    user,
    signOut,
    googleLogin
  };

  // use a provider to pass down the value
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
