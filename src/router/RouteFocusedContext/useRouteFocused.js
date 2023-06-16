// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const RouteFocusedContext = require('./RouteFocusedContext');

const useRouteFocused = () => {
    return React.useContext(RouteFocusedContext);
};

module.exports = useRouteFocused;
