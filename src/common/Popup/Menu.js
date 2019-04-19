const React = require('react');

const Menu = React.forwardRef(({ children }, ref) => (
    <div ref={ref}>
        {children}
    </div>
));

Menu.displayName = 'Popup.Menu';

module.exports = Menu;
