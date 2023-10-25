// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const styles = require('./styles');

const TooltipItem = React.memo(({ className, active, label, position, margin, parent }) => {
    const ref = React.useRef(null);

    const [style, setStyle] = React.useState(null);

    const onTransitionEnd = React.useCallback(() => {
        if (!active) {
            setStyle(null);
        }
    }, [active]);

    React.useEffect(() => {
        if (!ref.current) return setStyle(null);

        const tooltipBounds = ref.current.getBoundingClientRect();
        const parentBounds = parent.getBoundingClientRect();

        switch (position) {
            case 'top':
                return setStyle({
                    top: `${parentBounds.top - tooltipBounds.height - margin}px`,
                    left: `${(parentBounds.left + (parentBounds.width / 2)) - (tooltipBounds.width / 2)}px`,
                });
            case 'bottom':
                return setStyle({
                    top: `${parentBounds.top + parentBounds.height + margin}px`,
                    left: `${(parentBounds.left + (parentBounds.width / 2)) - (tooltipBounds.width / 2)}px`,
                });
            case 'left':
                return setStyle({
                    top: `${parentBounds.top + (parentBounds.height / 2) - (tooltipBounds.height / 2)}px`,
                    left: `${(parentBounds.left - tooltipBounds.width - margin)}px`,
                });
            case 'right':
                return setStyle({
                    top: `${parentBounds.top + (parentBounds.height / 2) - (tooltipBounds.height / 2)}px`,
                    left: `${(parentBounds.left + parentBounds.width + margin)}px`,
                });
        }
    }, [active, position, margin, parent, label]);

    return (
        <div ref={ref} className={classNames(className, styles['tooltip-item'], { 'active': active })} style={style} onTransitionEnd={onTransitionEnd}>
            { label }
        </div>
    );
});

TooltipItem.displayName = 'TooltipItem';

TooltipItem.propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool,
    label: PropTypes.string,
    position: PropTypes.string,
    margin: PropTypes.number,
    parent: PropTypes.instanceOf(HTMLElement),
};

module.exports = TooltipItem;
