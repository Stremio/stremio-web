// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useState, createRef } = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const TooltipContext = require('./TooltipContext');
const styles = require('./styles');

const TooltipProvider = ({ children, className }) => {
    const [tooltips, setTooltips] = useState([]);

    const add = ({ id, label, position, margin = 15, parent }) => {
        const ref = createRef(null);

        const tooltip = {
            ref,
            id,
            label,
            position,
            margin: margin,
            active: false,
            parent,
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

    const toggle = (id, state) => {
        setTooltips((tooltips) => (
            tooltips.map((tooltip) => {
                if (tooltip.id === id) {
                    tooltip.active = state;
                }
                return tooltip;
            })
        ));
    };

    const style = (ref, position, margin, active, parent) => {
        if (!active) return {};

        const tooltipHeight = ref.current?.offsetHeight ?? 0;
        const tooltipWidth = ref.current?.offsetWidth ?? 0;
        const parentBounds = parent.getBoundingClientRect();

        switch (position) {
            case 'top':
                return {
                    top: `${parentBounds.top - tooltipHeight - margin}px`,
                    left: `${(parentBounds.left + (parentBounds.width / 2)) - (tooltipWidth / 2)}px`,
                };
            case 'bottom':
                return {
                    top: `${parentBounds.top + parentBounds.height + margin}px`,
                    left: `${(parentBounds.left + (parentBounds.width / 2)) - (tooltipWidth / 2)}px`,
                };
            case 'left':
                return {
                    top: `${parentBounds.top + (parentBounds.height / 2) - (tooltipHeight / 2)}px`,
                    left: `${(parentBounds.left - tooltipWidth - margin)}px`,
                };
            case 'right':
                return {
                    top: `${parentBounds.top + (parentBounds.height / 2) - (tooltipHeight / 2)}px`,
                    left: `${(parentBounds.left + parentBounds.width + margin)}px`,
                };
        }
    };

    return (
        <TooltipContext.Provider value={{ add, remove, toggle }}>
            { children }
            <div className={'tooltips-container'}>
                {
                    tooltips.map(({ ref, id, label, position, margin, active, parent }) => (
                        <div
                            key={id}
                            ref={ref}
                            className={classNames(className, styles['tooltip-container'], { 'active': active })}
                            style={style(ref, position, margin, active, parent)}
                        >
                            { label }
                        </div>
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
