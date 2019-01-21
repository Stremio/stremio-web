import React from 'react';
import FocusableContext from './FocusableContext';

const Focusable = ({ children }) => {
    return (
        <FocusableContext.Consumer>
            {focusable => React.cloneElement(React.Children.only(children), { tabIndex: focusable ? 0 : -1 })}
        </FocusableContext.Consumer>
    );
};

export default Focusable;
