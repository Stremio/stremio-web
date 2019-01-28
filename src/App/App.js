import React, { StrictMode } from 'react';
import { Router } from 'stremio-common';
import routerConfig from './routerConfig';
import styles from './styles';

const App = () => (
    <StrictMode>
        <Router className={styles['router']} config={routerConfig} />
    </StrictMode>
);

export default App;
