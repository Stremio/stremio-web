const React = require('react');

const Label = React.forwardRef(({ children, ...props }, ref) => {
    return React.cloneElement(React.Children.only(children), { ...props, ref });
});

Label.displayName = 'Popup.Label';

module.exports = Label;
