import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import styles from './styles';

const Board = () => <div style={{ color: 'pink', paddingTop: 40 }}>You're on the Board Tab</div>;
const Discover = () => <div style={{ color: 'pink', paddingTop: 40 }}>You're on the Discover Tab</div>;
const Library = () => <div style={{ color: 'pink', paddingTop: 40 }}>You're on the Library Tab</div>;
const Calendar = () => <div style={{ color: 'pink', paddingTop: 40 }}>You're on the Calendar Tab</div>;

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
