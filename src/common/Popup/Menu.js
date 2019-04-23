const PropTypes = require('prop-types');

const Menu = ({ children }) => children;

Menu.displayName = 'Popup.Menu';

Menu.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Menu;
