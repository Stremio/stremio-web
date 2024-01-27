// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const TooltipContext = require('./TooltipContext');
const TooltipItem = require('./TooltipItem');

const TooltipProvider = ({ children, className }) => {
    const [tooltips, setTooltips] = React.useState([]);

    const add = (options) => {
        const tooltip = {
            ...options,
            active: false,
        };

        setTooltips((tooltips) => ([
            ...tooltips,
            tooltip,
        ]));
    };

    const remove = (id) => {
        setTooltips((tooltips) => (
            tooltips.filter((tooltip) => tooltip.id !== id)
        ));
    };

    const update = (id, state) => {
        setTooltips((tooltips) => (
            tooltips.map((tooltip) => {
                if (tooltip.id === id) {
                    tooltip = {
                        ...tooltip,
                        ...state,
                    };
                }
                return tooltip;
            })
        ));
    };

    return (
        <TooltipContext.Provider value={{ add, remove, update }}>
            { children }
            <div className={'tooltips-items-container'}>
                {
                    tooltips.map(({ id, ...tooltip }) => (
                        <TooltipItem
                            key={id}
                            className={className}
                            {...tooltip}
                        />
                    ))
                }
            </div>
        </TooltipContext.Provider>
    );
};

TooltipProvider.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

module.exports = TooltipProvider;
