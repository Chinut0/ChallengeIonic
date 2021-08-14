import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import { toast } from '../component/toast'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [showLogin, setShowLogin] = useState(true)

    const { loginUser, registerUser } = useAuth()

    //Login Firebase
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //Registrar Firebase
    const [rEmail, setREmail] = useState('')
    const [rPassword, setRPassword] = useState('')
    const [rPasswordC, setRPasswordC] = useState('')

    const handleLogin = async () => {
        setLoading(true)
        const result = await loginUser(email, password)
        setLoading(false)
        if (!result) {
            toast('Email o password incorrecto')
        } else {
            toast('Redireccionando...')
            window.location.reload()
        }
    }

    const handleRegister = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()

        if (rPassword !== rPasswordC) {
            return toast('Las contraseñas no coinciden')
        }
        if (rEmail.trim() === '' || rPassword.trim() === '') {
            return toast('El email y contraseña son requeridos')
        }
        setLoading(true)
        const result = await registerUser(rEmail, rPassword)
        window.location.reload()
        setLoading(false)
    }


    return (
        <>
            {showLogin ?
                <IonPage>
                    <IonHeader>
                        <IonToolbar color='primary'>
                            <IonTitle >LOGIN</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className='ion-padding'>
                        <IonLoading
                            isOpen={loading}
                            message={'Cargando...'}
                        />
                        <IonItem>
                            <IonInput type='text' placeholder='email' onIonChange={(e: any) => setEmail(e.target.value)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput type='password' placeholder='password' onIonChange={(e: any) => setPassword(e.target.value)}></IonInput>
                        </IonItem>
                        <IonButton color="secondary" expand="full" fill="solid" type='submit' onClick={handleLogin}>Aceptar</IonButton>
                        <div style={{ textAlign: 'right' }} onClick={() => setShowLogin(!showLogin)}>Ir a nuevo usuario</div>
                    </IonContent>
                </IonPage >
                :
                <IonPage>
                    <IonHeader>
                        <IonToolbar color='primary'>
                            <IonTitle >Nuevo Usuario</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className='ion-padding'>
                        <IonLoading
                            isOpen={loading}
                            message={'Cargando...'}
                        />
                        <form onSubmit={(evt) => handleRegister(evt)}>
                            <IonItem>
                                <IonInput type='email' placeholder='email' onIonChange={(e: any) => setREmail(e.target.value)} required></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput type='password' minlength={6} placeholder='password' onIonChange={(e: any) => setRPassword(e.target.value)} required></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput type='password' minlength={6} placeholder='confirmación' onIonChange={(e: any) => setRPasswordC(e.target.value)} required></IonInput>
                            </IonItem>
                            <IonButton type='submit' color="secondary" expand="full" fill="solid">Registrar</IonButton>
                            <div style={{ textAlign: 'right' }} onClick={() => setShowLogin(!showLogin)}>Ir a Login</div>
                        </form>
                    </IonContent>
                </IonPage>
            }
        </>
    )
}

export default Login

