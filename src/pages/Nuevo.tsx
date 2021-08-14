import React, { useState } from 'react'
import { Services } from '../backend/Services'
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { useIonRouter } from "@ionic/react";
import $ from 'jquery'


const Nuevo = () => {
    const [imagen, setImagen] = useState<any>()
    const [loading, setLoading] = useState(false)
    const router = useIonRouter();

    const handleUploadPhoto = async (fileChangeEvent: any) => {
        setImagen(fileChangeEvent.target.files[0]);
    };

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        setLoading(true)
        let formData = await new FormData();
        formData.append("image", imagen, imagen.name);
        formData.append("name", $('#name').val() + '');
        formData.append("description", $('#description').val() + '');
        formData.append("quantity", $('#quantity').val() + '');
        formData.append("price", $('#price').val() + '');
        formData.append("status", $('#status').val() + '');

        try {
            const result = await new Services().create(formData)
            router.push("/productos", 'back');
        } catch (e) {
            console.log(e);
        }
    }

    const margin = { marginBottom: '10px' }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='primary'>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Nuevo Producto</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding'>
                <IonLoading
                    isOpen={loading}
                    message={'Cargando...'}
                />
                <form onSubmit={(evt) => handleSubmit(evt)}>
                    <IonLabel color='secondary'><h2>Nombre:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type="text" id='name' placeholder='Nombre..' required></IonInput>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Descripcion:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type="text" id='description' placeholder='Descripción..' required></IonInput>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Cantidad:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type='number' id='quantity' pattern="[0-9]*" placeholder='Precio..' required></IonInput>
                    </IonItem>


                    <IonLabel color='secondary'><h2>Precio:</h2></IonLabel>
                    <IonItem style={margin}>
                        <IonInput type="number" id='price' step='any' placeholder='Precio..' required></IonInput>
                    </IonItem>

                    <IonLabel color='secondary'><h2>Seleccionar Imagen:</h2></IonLabel>

                    <IonItem style={margin}>
                        <input type="file" onChange={(evt) => handleUploadPhoto(evt)} required></input>
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
                    <IonButton color="success" expand="full" fill="solid" type='submit' >Crear</IonButton>
                </form>
            </IonContent>
        </IonPage >

    )
}

export default Nuevo



