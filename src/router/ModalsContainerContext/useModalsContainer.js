// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const ModalsContainerContext = require('./ModalsContainerContext');

const useModalsContainer = () => {
    return React.useContext(ModalsContainerContext);
};

module.exports = useModalsContainer;
