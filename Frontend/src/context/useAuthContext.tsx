import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {auth} from "@/firebase"
import type { ChildrenType } from "@/types";

const AuthContext = createContext<UseAuthType>({
    loading:true,
    userLoggedIn:false,
    currentUser: null
});


function getInitials(name:string){
    const words = name.trim().split(/\s+/);
    const firstInitial = words[0]?.[0]?.toUpperCase() || '';
    const secondInitial = words[1]?.[0]?.toUpperCase() || '';
    return firstInitial + secondInitial;
}

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}:ChildrenType) {

    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

   
    async function initializeUser(user:any){
        console.log("here1")
        if(user){

            let initials = getInitials(user.email[0]);
            let displayName = user.email;

            if(user.displayName){
                initials=getInitials(user.displayName);
                displayName = user.displayName;
            }

            setCurrentUser({...user, initials,displayName})
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

     useEffect(()=>{
        console.log("started")
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    },[])


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