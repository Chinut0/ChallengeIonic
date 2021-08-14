import React, { useContext, createContext, useState, useEffect } from 'react'
import { Services } from '../backend/Services';
import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCUZkVRVwmX1jzi_GleaIudBTc0gAytvrM",
    authDomain: "challenge-daf61.firebaseapp.com",
    projectId: "challenge-daf61",
    storageBucket: "challenge-daf61.appspot.com",
    messagingSenderId: "115879031064",
    appId: "1:115879031064:web:43fb6c65c06fb80c5bae6d",
    measurementId: "G-7LN6XDL7Y8"
};

firebase.initializeApp(config)

export const AuthLaravelContext = createContext({})

export function useAuth() {
    return useContext(AuthLaravelContext) as usuario
}

interface usuario {
    logeado: boolean,
    loading: boolean,
    loginUser: (email: string, password: string) => boolean,
    registerUser: (email: string, password: string) => boolean,
    logout: () => void,
}

//Login Firebase
async function loginUser(email: string, password: string) {
    try {
        let result = await firebase.auth().signInWithEmailAndPassword(email, password)
        let token = await result.user?.getIdToken();
        await getBackToken(token)
        return true
    } catch (e) {
        console.log(e);
        return false
    }
}


//Logout
export async function logout() {
    try {
        await firebase.auth().signOut();
        await new Services().logout()
        window.location.reload()
    } catch (e) {
        console.log(e);
    }
}


//Registrar Firebase
export async function registerUser(email: string, password: string) {
    try {
        let result = await firebase.auth().createUserWithEmailAndPassword(email, password)
        let token = await result.user?.getIdToken();
        await getBackToken(token)
        return true
    } catch (e) {
        console.log(e);
        return false
    }
}

//Login o registrar en el back
const getBackToken = async (token: any) => {
    let formData = new FormData();
    formData.append("token", token);
    const backToken = await new Services().generateToken(formData)
    localStorage.setItem('backToken', backToken)
}



export const LaravelProvider = ({ children }: any) => {
    const [logeado, setLogeado] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    const data = {
        logeado: logeado,
        loading: loading,
        loginUser,
        registerUser,
        logout,
    }
    //Consultar Usuario
    const consultarUsuario = async () => {
        try {
            let response = await new Services().queryLogeado()
            setLogeado(response);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        consultarUsuario()
    }, [])


    return (

        <AuthLaravelContext.Provider value={data}>
            {children}
        </AuthLaravelContext.Provider>
    )
}