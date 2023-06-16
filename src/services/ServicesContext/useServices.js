// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const ServicesContext = require('./ServicesContext');

const useServices = () => {
    return React.useContext(ServicesContext);
};

module.exports = useServices;
