// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const TooltipContext = require('./TooltipContext');

const useTooltip = () => {
    return React.useContext(TooltipContext);
};

module.exports = useTooltip;
