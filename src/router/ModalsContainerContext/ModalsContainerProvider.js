// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const ModalsContainerContext = require('./ModalsContainerContext');

const ModalsContainerProvider = ({ children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <ModalsContainerContext.Provider value={container}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={'modals-container'} />
        </ModalsContainerContext.Provider>
    );
};

ModalsContainerProvider.propTypes = {
    children: PropTypes.node
};

module.exports = ModalsContainerProvider;
