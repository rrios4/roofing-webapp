import supabase from "../utils/supabaseClient";
import { useState, useEffect, useContext, createContext } from 'react';

const authContext = createContext()

export const AuthProvider = ({children}) => {
    const auth = useProviderAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

function useProviderAuth() {
    const [user, setUser] = useState(null);

    const Login = async(email, password) => {
        const { data, error } = await supabase.auth.signIn({email, password})
    
        if(error){
            console.log(error)
        }

        return {data, error}
    }

    const Logout = async () => {
        const {error} = await supabase.auth.signOut();

        if(error){
            console.log(error)
        }

        setUser(null)
    }

    const SignUp = async(email, password) => {
        const { data, error } = await supabase.auth.signUp({email, password})
    
        if(error){
            console.log(error)
        }

        return {data, error}
    }

    const googleLogin = async() => {
        const { error } = await supabase.auth.signIn({
            provider: 'google',
        })

        if(error){
            console.log(error)
        }

        return {error}
    }

    useEffect(() => {
        const user = supabase.auth.user()
        setUser(user)

      const auth = supabase.auth.onAuthStateChange((event, session) => {
          if(event === 'SIGNED_IN'){
              setUser(session.user)
          }

          if(event === 'SIGNED_OUT'){
              setUser(null)
          }
      })

      return () => auth.data.unsubscribe();
    
    }, [])
    
    return { user, Login, Logout, SignUp, googleLogin }
}