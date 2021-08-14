import { useEffect, useState } from 'react'
import { Services, iProducts } from '../backend/Services'
import { IonAvatar, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonItemSliding, IonLabel, IonList, IonLoading, IonPage, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { GrNext } from "react-icons/gr";
import { useIonRouter } from "@ionic/react";
import { useIonViewDidEnter, useIonViewDidLeave, } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { add } from 'ionicons/icons'
import { useAuth } from '../context/AuthContext';

const Productos = () => {

    const [products, setProducts] = useState<iProducts[] | undefined>()
    const [load, setLoad] = useState<boolean>(true)
    const [loading, setLoading] = useState(true)
    const router = useIonRouter();
    const { logout } = useAuth()

    const queryProducts = async () => {
        setLoading(true)
        try {
            const result = await new Services().queryPorducts()
            setProducts(result)
            setLoad(false)
            setLoading(false)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        load && queryProducts()
    }, [load])

    useIonViewDidLeave(() => setProducts(undefined));
    useIonViewDidEnter(() => setLoad(true));

    const handleImgPath = (img: string) => process.env.REACT_APP_API_URL + 'img/' + img

    const handleRoute = (id: number) => router.push("/producto/" + id);

    const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
        await queryProducts()
        event.detail.complete();
    }

    const handleAddProduct = () => router.push("/nuevo");

    const handleLogout = () => {
        setLoading(true)
        logout()
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonTitle>Mis Productos</IonTitle>
                    <IonButtons slot="end" >
                        <IonButton color='danger' size='small' fill='solid' onClick={handleLogout}>
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding'>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonLoading
                    isOpen={loading}
                    message={'Cargando...'}
                />

                <IonList>
                    {products && products.map((e, index) =>
                        <IonItemSliding key={index} onClick={() => handleRoute(e.id)} className="item ios in-list ion-activatable ion-focusable hydrated item-label" >
                            <IonItem>
                                <IonAvatar slot='start' className='mr-2'>
                                    <img src={handleImgPath(e.image)} />
                                </IonAvatar>
                                <IonLabel className="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated">
                                    <IonText color='primary'>
                                        <h2>{e.id} - {e.name}</h2>
                                    </IonText>
                                    <IonText color='medium'>
                                        <p>{e.description}</p>
                                    </IonText>
                                </IonLabel>
                                <IonButtons>
                                    <GrNext />
                                </IonButtons>
                            </IonItem>
                        </IonItemSliding>
                    )}
                </IonList>
                <IonFab onClick={handleAddProduct} vertical="bottom" horizontal="end" color="success" slot="fixed" style={{ margin: '15px' }}>
                    <IonFabButton>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage >

    )
}

export default Productos

