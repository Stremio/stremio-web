import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavTab from './NavTab';
import styles from './styles';

class NavBar extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextContext.router !== this.context.router;
    }

    render() {
        return (
            <nav className={styles['nav-bar']}>
                <NavTab to={'/'} exact={true} icon={'ic_board'} label={'Board'} />
                <NavTab to={'/discover'} icon={'ic_discover'} label={'Discover'} />
                <NavTab to={'/library'} icon={'ic_library'} label={'My Library'} />
                <NavTab to={'/calendar'} icon={'ic_calendar'} label={'Calendar'} />
            </nav>
        );
    }
}

NavBar.contextTypes = {
    router: PropTypes.object.isRequired
};

export default NavBar;
