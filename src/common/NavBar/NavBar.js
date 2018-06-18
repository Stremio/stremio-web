import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavTab from './NavTab';
import SearchInput from './SearchInput';
import styles from './styles';

class NavBar extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextContext.router !== this.context.router;
    }

    render() {
        return (
            <nav className={styles['nav-bar']}>
                <div className={styles['nav-tabs']}>
                    {this.props.tabs.map(tab => <NavTab key={tab.to} {...tab} />)}
                </div>
                {this.props.title.length > 0 ? <h2 className={styles['nav-title']}>{this.props.title}</h2> : null}
                {this.props.searchInput ? <SearchInput /> : null}
            </nav>
        );
    }
}

NavBar.contextTypes = {
    router: PropTypes.object.isRequired
};

NavBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        exact: PropTypes.bool,
        replace: PropTypes.bool
    })).isRequired,
    title: PropTypes.string.isRequired,
    searchInput: PropTypes.bool.isRequired
};

NavBar.defaultProps = {
    tabs: [],
    title: '',
    searchInput: false
};

export default NavBar;
