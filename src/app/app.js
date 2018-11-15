import React, { PureComponent } from 'react';
import { Router } from 'stremio-common';
import routerConfig from './routerConfig';
import styles from './styles';

class App extends PureComponent {
    render() {
        return (
            <Router
                routeContainerClassName={styles['route-container']}
                config={routerConfig}
            />
        );
    }
}

export default App;
