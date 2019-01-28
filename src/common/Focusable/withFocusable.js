import React from 'react';
import FocusableContext from './FocusableContext';

const withFocusable = (Component) => {
    return function withFocusable(props) {
        return (
            <FocusableContext.Consumer>
                {focusable => <Component {...props} focusable={focusable} />}
            </FocusableContext.Consumer>
        );
    };
};

export default withFocusable;
