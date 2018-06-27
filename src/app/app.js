import React, { PureComponent } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Main, Addons } from 'stremio-routes';
import styles from './styles';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.history = createHashHistory();
    }

    render() {
        return (
            <div className={styles['app']}>
                <Router history={this.history}>
                    <Switch>
                        <Route path={'/(discover|library|calendar|search)?'} exact={true} component={Main} />
                        <Route path={'/addons'} component={Addons} />
                        <Redirect to={'/'} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
