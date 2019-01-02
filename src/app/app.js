import React, { PureComponent, StrictMode } from 'react';
import { Router } from 'stremio-common';
import routerConfig from './routerConfig';
import styles from './styles';

class App extends PureComponent {
    render() {
        return (
            <StrictMode>
                <Router
                    routeContainerClassName={styles['route-container']}
                    config={routerConfig}
                />
            </StrictMode>
        );
    }
}

export default App;
