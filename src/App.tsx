import { Route } from 'react-router-dom';
import { IonApp, IonContent, IonLoading, IonPage, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useState } from 'react'
import Productos from './pages/Productos';
import Producto from './pages/Producto';
import Nuevo from './pages/Nuevo';
import Edit from './pages/Edit';
import Login from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { logeado, loading } = useAuth()

  const content = () => {
    return (
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path='/' exact component={Productos} />
          <Route path='/productos' component={Productos} />
          <Route path='/producto/:id' component={Producto} />
          <Route path='/edit/:id' component={Edit} />
          <Route path='/nuevo' component={Nuevo} />
        </IonRouterOutlet>
      </IonReactRouter>
    )
  }

  return (
    <IonApp>
      {loading ?
        <IonPage>
          <IonContent className='ion-padding'>
            <IonLoading
              isOpen={loading}
              message={'Cargando...'}
            />
          </IonContent>
        </IonPage>
        :
        <>
          {logeado === false && <Login></Login>}
          {logeado === true && content()}
        </>
      }
    </IonApp>
  );
}


export default App;


