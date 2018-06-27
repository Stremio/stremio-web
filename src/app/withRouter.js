import React from 'react';
import RouterContext from './routerContext';

const withRouter = (Component) => {
    return (props) => (
        <RouterContext.Consumer>
            {context => <Component {...props} {...context} />}
        </RouterContext.Consumer>
    );
};

export default withRouter;
