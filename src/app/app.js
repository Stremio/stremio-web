import React, { PureComponent } from 'react';
import { Router } from 'stremio-common';
import routerConfig from './routerConfig';
import styles from './styles';

class App extends PureComponent {
    render() {
        return (
            <div className={styles['app']}>
                <Router
                    routerContainerClassName={styles['router-container']}
                    routeContainerClassName={styles['route-container']}
                    config={routerConfig}
                />
            </div>
        );
    }
}

export default App;
