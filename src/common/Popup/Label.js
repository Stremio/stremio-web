import React from 'react';

const Label = React.forwardRef(({ children, ...props }, ref) => {
    return React.cloneElement(React.Children.only(children), { ...props, ref });
});

Label.displayName = 'Popup.Label';

export default Label;
