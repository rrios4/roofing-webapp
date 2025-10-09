import React from 'react';
import { useContext, useState, useEffect, createContext } from 'react';
import supabase from '../lib/supabase-client';

type Props = {
  children: React.ReactNode;
};

export type AuthValueTypes = {
  session: any;
  user: any;
  signOut: any;
  googleLogin: any;
};

// create a context for authentication
const AuthContext = createContext({ session: null, user: null, signOut: () => {} });

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState();
  const [session, setSession] = useState<any>();
  const [loading, setLoading] = useState<any>(true);

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes:
          'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
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
      // @ts-expect-error needs to address session info here
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // @ts-expect-error need to address session info here
      setUser(session?.user);
      setLoading(false);
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value: AuthValueTypes = {
    session,
    user,
    signOut: () => supabase.auth.signOut(),
    googleLogin
  };

  // use a provider to pass down the value
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
