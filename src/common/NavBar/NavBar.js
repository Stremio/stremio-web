import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import NavTab from './NavTab';
import SearchInput from './SearchInput';
import UserNotifications from './UserNotifications';
import UserMenu from './UserMenu';
import styles from './styles';

class NavBar extends PureComponent {
    render() {
        return (
            <nav className={styles['nav-bar']}>
                {this.props.tabs.map(tab => <NavTab key={tab.to} {...tab} />)}
                {this.props.title.length > 0 ? <h2 className={styles['nav-title']}>{this.props.title}</h2> : null}
                {this.props.searchInput ? <SearchInput className={styles['search-input']} /> : null}
                {this.props.userNotifications ? <UserNotifications className={styles['user-notifications']} /> : null}
                {this.props.userMenu ? <UserMenu className={styles['user-menu']} /> : null}
            </nav>
        );
    }
}

NavBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        exact: PropTypes.bool,
        replace: PropTypes.bool
    })).isRequired,
    title: PropTypes.string.isRequired,
    searchInput: PropTypes.bool.isRequired,
    userNotifications: PropTypes.bool.isRequired,
    userMenu: PropTypes.bool.isRequired
};

NavBar.defaultProps = {
    tabs: [],
    title: '',
    searchInput: false,
    userNotifications: false,
    userMenu: false
};

export default NavBar;
