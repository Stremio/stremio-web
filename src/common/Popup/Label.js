import React from 'react';

const Label = ({ children, ...props }, ref) => {
    return React.cloneElement(React.Children.only(children), { ref, ...props });
};

export default React.forwardRef(Label);
