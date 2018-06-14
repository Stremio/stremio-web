import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Board, Discover, Library, Calendar } from 'stremio-routes';
import NavBar from './NavBar';
import styles from './styles';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className={styles['app']}>
                    <NavBar />
                    <Switch>
                        <Route path={'/'} exact={true} component={Board} />
                        <Route path={'/discover'} component={Discover} />
                        <Route path={'/library'} component={Library} />
                        <Route path={'/calendar'} component={Calendar} />
                        <Redirect to={'/'} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
