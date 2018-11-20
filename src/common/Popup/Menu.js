import React from 'react';

const Menu = ({ children }) => {
    return React.Children.only(children);
};

export default Menu;
