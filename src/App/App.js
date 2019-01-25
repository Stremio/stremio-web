import React, { StrictMode } from 'react';
import { Router } from 'stremio-common';
import ModalsContainerProvider from './ModalsContainerProvider';
import RouterFocusableProvider from './RouterFocusableProvider';
import routerConfig from './routerConfig';
import styles from './styles';

const App = () => (
    <StrictMode>
        <ModalsContainerProvider modalsContainerClassName={styles['application-layer']}>
            <RouterFocusableProvider routesContainerClassName={styles['application-layer']}>
                <Router routeClassName={styles['route']} config={routerConfig} />
            </RouterFocusableProvider>
        </ModalsContainerProvider>
    </StrictMode>
);

export default App;
