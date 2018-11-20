import React from 'react';

const Label = React.forwardRef(({ children, ...props }, ref) => {
    return React.cloneElement(React.Children.only(children), { ref, ...props });
});

export default Label;
