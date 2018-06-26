import React, { PureComponent } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Main, Addons } from 'stremio-routes';
import styles from './styles';

class App extends PureComponent {
    render() {
        return (
            <div className={styles['app']}>
                <HashRouter>
                    <Switch>
                        <Route path={'/(discover|library|calendar|search)?'} exact={true} component={Main} />
                        <Route path={'/addons'} component={Addons} />
                        <Redirect to={'/'} />
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

export default App;
