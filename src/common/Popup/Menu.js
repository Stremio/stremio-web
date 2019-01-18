import React from 'react';

const Menu = React.forwardRef(({ children }, ref) => (
    <div ref={ref}>
        {children}
    </div>
));

export default Menu;
