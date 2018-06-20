import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Menu = ({ children }) => {
    return <Fragment>{children}</Fragment>;
};

Menu.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number
};

export default Menu;
