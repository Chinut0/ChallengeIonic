import React, { useContext, createContext, useState, useEffect } from 'react'
import { Services } from '../backend/Services';
import firebase from 'firebase'

const config = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROYECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID,
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