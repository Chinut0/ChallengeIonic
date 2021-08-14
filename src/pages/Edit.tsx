import React, { useEffect, useState } from 'react'
import { Services, iProducts } from '../backend/Services'
import { IonAvatar, IonBackButton, IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { GrNext } from "react-icons/gr";
import { IoExitOutline } from "react-icons/io5";
import { useIonRouter } from "@ionic/react";
import { useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { add, camera } from 'ionicons/icons'
import $ from 'jquery'
import { useParams } from 'react-router-dom';


interface iParams {
    id: string
}

const Edit = () => {
    const [cargarDatos, setCargarDatos] = useState<boolean>(true)
    const [product, setProduct] = useState<iProducts | undefined>()
    const [loading, setLoading] = useState(false)
    const [imagen, setImagen] = useState<any>()
    const router = useIonRouter();

    const params: iParams = useParams();

    const queryProduct = async () => {

        setLoading(true)
        try {
            const response = await new Services().queryProduct(params.id)
            setProduct(response)
            setLoading(false)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        queryProduct()
    }, [])

    useEffect(() => {
        if (product && cargarDatos) {
            $('#name').val(product.name)
            $('#description').val(product.description)
            $('#quantity').val(product.quantity)
            $('#price').val(product.price)
            setCargarDatos(false)
        }
    }, [product])

    const margin = { marginBottom: '10px' }

    const openFileDialog = () => {
        (document as any).getElementById("image").click();
    };

    const setImage = (_event: any) => {
        let f = _event.target.files![0];
        console.log(f)
        setImagen(f)
    }

    const handleUploadPhoto = async (fileChangeEvent: any) => {
        setImagen(fileChangeEvent.target.files[0]);
    };

    const handleEdit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setLoading(true)

        let formData = await new FormData();
        imagen && formData.append("image", imagen, imagen.name);
        $('#name').val() && formData.append("name", $('#name').val() + '');
        $('#description').val() && formData.append("description", $('#description').val() + '');
        $('#quantity').val() && formData.append("quantity", $('#quantity').val() + '');
        $('#price').val() && formData.append("price", $('#price').val() + '');
        $('#status').val() && formData.append("status", $('#status').val() + '');
        formData.append("_method", 'put');

        try {
            await new Services().update(formData, params.id)
            router.push("/productos", 'back');
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Editar Producto - {params.id}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding'>
                <IonLoading
                    isOpen={loading}
                    message={'Cargando...'}
                />
                <form onSubmit={(evt) => handleEdit(evt)}>
                    <IonLabel color='secondary'><h2>Nombre:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type="text" id='name' placeholder='Nombre..' ></IonInput>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Descripcion:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type="text" id='description' placeholder='Descripción..' ></IonInput>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Cantidad:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type='text' id='quantity' pattern="[0-9]*" placeholder='Precio..' ></IonInput>
                    </IonItem>


                    <IonLabel color='secondary'><h2>Precio:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type="number" id='price' step='any' placeholder='Precio..' ></IonInput>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Seleccionar Imagen:</h2></IonLabel>

                    <IonItem style={margin}>
                        <input type="file" onChange={(evt) => handleUploadPhoto(evt)} ></input>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Estado:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonSelect
                            id='status'
                            multiple={false}
                            title='asdf'
                            value="no disponible"
                        >
                            <IonSelectOption value="no disponible">No Disponible</IonSelectOption>
                            <IonSelectOption value="disponible">Disponible</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonButton color="success" expand="full" fill="solid" type='submit' >Actualizar</IonButton>
                </form>
            </IonContent>
        </IonPage >

    )
}

export default Edit



