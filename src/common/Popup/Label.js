import React from 'react';

const Label = ({ children, forwardedRef, onClick }) => {
    return React.cloneElement(React.Children.only(children), { ref: forwardedRef, onClick });
};

export default Label;
