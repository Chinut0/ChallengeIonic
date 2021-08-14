import React, { useEffect, useState } from 'react'
import { Services, iProducts } from '../backend/Services'
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonPage, IonRefresher, IonRefresherContent, IonRow, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useIonRouter } from "@ionic/react";
import { RefresherEventDetail } from '@ionic/core';

interface iParams {
    id: string
}

const Producto = () => {
    const [product, setProduct] = useState<iProducts | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [load, setLoad] = useState(true)

    const params: iParams = useParams();
    const router = useIonRouter();

    const queryProduct = async () => {
        setLoading(true)
        try {
            const p = await new Services().queryProduct(params.id)
            typeof (p) !== 'undefined' && setProduct(p)
            setLoading(false)
            setLoad(false)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        load && queryProduct()
    }, [load])

    useIonViewDidLeave(() => setProduct(undefined));
    useIonViewDidEnter(() => setLoad(true));

    const handleEdit = () => router.push("/edit/" + product?.id);

    const handleDelete = async () => {
        setLoading(true)
        if (product) {
            try {
                await new Services().delete(product?.id)
                router.push("/productos", 'back');
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleImgPath = (img: string) => process.env.REACT_APP_API_URL + 'img/' + img

    const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
        await queryProduct()
        event.detail.complete();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Detalle</IonTitle>
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
                {typeof (product) !== 'undefined' &&
                    <>
                        <IonCard>
                            <IonCardHeader>
                                <img style={{ 'height': '130px', 'width': '100%', 'margin': 'auto' }} src={handleImgPath(product.image)} />
                                {/* <IonCardSubtitle>Id: {product.id}</IonCardSubtitle> */}
                                <IonCardTitle>{product.id} - {product.name}</IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                <IonRow>
                                    <IonCol size='12'>
                                        {product.description}
                                    </IonCol>
                                    <IonCol></IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size='12'>
                                        <IonText color="primary">
                                            Precio: ${product.price}
                                        </IonText>
                                    </IonCol>
                                    <IonCol size='12'>
                                        <IonText color="secondary">
                                            Cantidad: {product.quantity}
                                        </IonText>
                                    </IonCol>
                                    {product.status === 'disponible' ?
                                        <IonCol size='12'>
                                            <IonText color="success">
                                                {product.status.toUpperCase()}
                                            </IonText>
                                        </IonCol>
                                        :
                                        <IonCol size='12'>
                                            <IonText color="danger">
                                                {product.status.toUpperCase()}
                                            </IonText>
                                        </IonCol>
                                    }
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                        <IonButton expand="full" fill="solid" color='secondary' onClick={handleEdit}>Modificar</IonButton>
                        <IonButton expand="full" fill="solid" color='danger' onClick={handleDelete}>Eliminar</IonButton>
                    </>

                }
            </IonContent>
        </IonPage >

    )
}

export default Producto
