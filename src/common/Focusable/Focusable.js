import React from 'react';
import FocusableContext from './FocusableContext';

const Focusable = React.forwardRef(({ children, ...props }, ref) => {
    return (
        <FocusableContext.Consumer>
            {focusable => React.cloneElement(React.Children.only(children), { ...props, ref, tabIndex: focusable ? 0 : -1 })}
        </FocusableContext.Consumer>
    );
});

Focusable.displayName = 'Focusable';

export default Focusable;
