import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Board, Discover, Library, Calendar, Addons } from 'stremio-routes';
import { NavBar } from 'stremio-common';
import styles from './styles';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className={styles['app']}>
                    <Switch>
                        <Route path={'/(discover|library|calendar)?'} exact={true}>
                            <div className={styles['app']}>
                                <NavBar
                                    tabs={[
                                        { icon: 'ic_board', label: 'Board', to: '/', exact: true },
                                        { icon: 'ic_discover', label: 'Discover', to: '/discover' },
                                        { icon: 'ic_library', label: 'Library', to: '/library' },
                                        { icon: 'ic_calendar', label: 'Calendar', to: '/calendar' }
                                    ]}
                                />
                                <Switch>
                                    <Route path={'/'} exact={true} component={Board} />
                                    <Route path={'/discover'} component={Discover} />
                                    <Route path={'/library'} component={Library} />
                                    <Route path={'/calendar'} component={Calendar} />
                                </Switch>
                            </div>
                        </Route>
                        <Route path={'/addons'} component={Addons} />
                        <Redirect to={'/'} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
