const React = require('react');
const PropTypes = require('prop-types');

const Menu = React.forwardRef(({ children }, ref) => (
    <div ref={ref}>
        {children}
    </div>
));

Menu.displayName = 'Popup.Menu';

Menu.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Menu;
