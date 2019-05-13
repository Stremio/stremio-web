const PropTypes = require('prop-types');

const Menu = ({ children }) => children;

Menu.displayName = 'Popup.Menu';

Menu.propTypes = {
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Menu;
