import React, { PureComponent, StrictMode } from 'react';
import { Router, Modal } from 'stremio-common';
import routerConfig from './routerConfig';
import styles from './styles';

class App extends PureComponent {
    render() {
        return (
            <StrictMode>
                <Router config={routerConfig} />
            </StrictMode>
        );
    }
}

const appContainerElement = document.getElementById('app');
const modalsContainerElement = document.getElementById('modals');

App.containerElement = appContainerElement;
Router.routesContainer = appContainerElement;
Router.routeClassName = styles['route-container'];
Modal.modalsContainer = modalsContainerElement;
Modal.modalClassName = styles['modal-container'];

export default App;
