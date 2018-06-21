import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NavBar } from 'stremio-common';
import { Board, Discover, Library, Calendar, Search } from 'stremio-routes';
import styles from './styles';

class Main extends Component {
    render() {
        return (
            <div className={styles['root-container']}>
                <NavBar
                    tabs={[
                        { icon: 'ic_board', label: 'Board', to: '/', exact: true, replace: true },
                        { icon: 'ic_discover', label: 'Discover', to: '/discover', replace: true },
                        { icon: 'ic_library', label: 'Library', to: '/library', replace: true },
                        { icon: 'ic_calendar', label: 'Calendar', to: '/calendar', replace: true }
                    ]}
                    searchInput={true}
                    userMenu={true}
                />
                <Switch>
                    <Route path={'/'} exact={true} component={Board} />
                    <Route path={'/discover'} component={Discover} />
                    <Route path={'/library'} component={Library} />
                    <Route path={'/calendar'} component={Calendar} />
                    <Route path={'/search'} component={Search} />
                </Switch>
            </div>
        );
    }
}

export default Main;
