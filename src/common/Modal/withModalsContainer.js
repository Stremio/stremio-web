import React from 'react';
import ModalsContainerContext from './ModalsContainerContext';

const withModalsContainer = (Component) => {
    return function withModalsContainer(props) {
        return (
            <ModalsContainerContext.Consumer>
                {modalsContainer => <Component {...props} modalsContainer={modalsContainer} />}
            </ModalsContainerContext.Consumer>
        );
    };
};

export default withModalsContainer;
