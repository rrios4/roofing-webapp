import { useContext, useState, useEffect, createContext } from 'react';
import supabase from '../utils/supabaseClient';

// create a context for authentication
const AuthContext = createContext({ session: null, user: null, signOut: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [session, setSession] = useState();
  const [loading, setLoading] = useState(true);

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
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
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user);
      setLoading(false);
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
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
