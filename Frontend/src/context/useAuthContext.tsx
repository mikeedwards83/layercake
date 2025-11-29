import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {auth} from "@/firebase"
import type { ChildrenType } from "@/types";

const AuthContext = createContext<UseAuthType>({
    loading:true,
    userLoggedIn:false,
    currentUser: null
});


export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}:ChildrenType) {

    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    },[])

    async function initializeUser(user:any){
        if(user){
            setCurrentUser({...user})
            setUserLoggedIn(true)
        }
        else{
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value:UseAuthType = {
        currentUser,
        userLoggedIn,
        loading
    }

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

type UseAuthType = {
    currentUser?: any;
    userLoggedIn: boolean,
    loading: boolean
}