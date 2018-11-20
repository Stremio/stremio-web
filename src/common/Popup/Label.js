import React from 'react';

const Label = ({ children, ...props }, ref) => {
    return React.cloneElement(React.Children.only(children), { ...props, ref });
};

export default React.forwardRef(Label);
