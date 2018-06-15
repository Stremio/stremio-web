import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Main, Addons } from 'stremio-routes';
import styles from './styles';

class App extends PureComponent {
    render() {
        return (
            <div className={styles['app']}>
                <BrowserRouter>
                    <Switch>
                        <Route path={'/(discover|library|calendar)?'} exact={true} component={Main} />
                        <Route path={'/addons'} component={Addons} />
                        <Redirect to={'/'} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
