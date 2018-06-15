import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NavBar } from 'stremio-common';
import Board from '../Board';
import Discover from '../Discover';
import Library from '../Library';
import Calendar from '../Calendar';
import Search from '../Search';
import styles from './styles';

class Main extends Component {
    render() {
        return (
            <div className={styles['root-container']}>
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
                    <Route path={'/search'} component={Search} />
                </Switch>
            </div>
        );
    }
}

export default Main;
