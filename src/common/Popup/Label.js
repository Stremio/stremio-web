import React from 'react';

const Label = React.forwardRef(({ children, onClick }, ref) => {
    return React.cloneElement(React.Children.only(children), { ref, onClick });
});

export default Label;
