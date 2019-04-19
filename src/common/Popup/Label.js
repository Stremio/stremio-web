const React = require('react');
const PropTypes = require('prop-types');

const Label = React.forwardRef(({ children, onClick }, ref) => {
    return React.cloneElement(React.Children.only(children), { ref, onClick });
});

Label.displayName = 'Popup.Label';

Label.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Label;
