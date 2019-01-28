import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const NavTab = ({ to, exact, replace, icon, label }) => (
    <NavLink className={styles['nav-tab']} activeClassName={styles['active']} to={to} exact={exact} replace={replace}>
        <Icon className={styles['nav-tab-icon']} icon={icon} />
        <h2 className={styles['nav-tab-label']}>{label}</h2>
    </NavLink>
);

NavTab.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    exact: PropTypes.bool.isRequired,
    replace: PropTypes.bool.isRequired
};

NavTab.defaultProps = {
    exact: false,
    replace: false
};

export default NavTab;
