import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const Board = () => <div style={{ backgroundColor: 'pink', paddingTop: 40 }}>You're on the Board Tab</div>;
const Discover = () => <div style={{ backgroundColor: 'pink', paddingTop: 40 }}>You're on the Discover Tab</div>;
const Library = () => <div style={{ backgroundColor: 'pink', paddingTop: 40 }}>You're on the Library Tab</div>;

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className={styles['app']}>
                    <div className={styles['nav-bar']}>
                        <NavLink className={styles['nav-tab']} activeClassName={styles['active']} to={'/'} exact={true} replace={false}>
                            <Icon
                                className={styles['nav-tab-icon']}
                                icon={'ic_board'}
                            />
                            Board
                        </NavLink>
                        <NavLink className={styles['nav-tab']} activeClassName={styles['active']} to={'/discover'} replace={false}>
                            <Icon
                                className={styles['nav-tab-icon']}
                                icon={'ic_discover'}
                            />
                            Discover
                        </NavLink>
                        <NavLink className={styles['nav-tab']} activeClassName={styles['active']} to={'/library'} replace={false}>
                            <Icon
                                className={styles['nav-tab-icon']}
                                icon={'ic_library'}
                            />
                            Library
                        </NavLink>
                    </div>
                    <Switch>
                        <Route path={'/'} exact={true} component={Board} />
                        <Route path={'/discover'} component={Discover} />
                        <Route path={'/library'} component={Library} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
