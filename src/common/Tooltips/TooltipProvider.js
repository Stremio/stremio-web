// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const TooltipContext = require('./TooltipContext');
const TooltipItem = require('./TooltipItem');

const TooltipProvider = ({ children, className }) => {
    const [tooltips, setTooltips] = React.useState([]);

    const add = React.useCallback((options) => {
        const tooltip = {
            ...options,
            active: false,
        };

        setTooltips((tooltips) => ([
            ...tooltips,
            tooltip,
        ]));
    }, []);

    const remove = React.useCallback((id) => {
        setTooltips((tooltips) => (
            tooltips.filter((tooltip) => tooltip.id !== id)
        ));
    }, []);

    const update = React.useCallback((id, state) => {
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
    }, []);

    const commands = React.useMemo(() => ({ add, remove, update }), [add, remove, update]);

    return (
        <TooltipContext.Provider value={commands}>
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
