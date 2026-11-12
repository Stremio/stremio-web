// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const useTooltip = require('../useTooltip');
const styles = require('./styles');

const createId = () => (Math.random() + 1).toString(36).substring(7);

const Tooltip = ({ label, position, margin = 15 }) => {
    const tooltip = useTooltip();

    const id = React.useRef(createId());
    const element = React.useRef(null);
    const hovered = React.useRef(false);
    const focused = React.useRef(false);

    const sync = () => {
        tooltip.update(id.current, {
            active: hovered.current || focused.current,
        });
    };

    const onMouseEnter = () => {
        hovered.current = true;
        sync();
    };

    const onMouseLeave = () => {
        hovered.current = false;
        sync();
    };

    const onFocusIn = () => {
        focused.current = true;
        sync();
    };

    const onFocusOut = () => {
        focused.current = false;
        sync();
    };

    React.useEffect(() => {
        tooltip.update(id.current, {
            label,
        });
    }, [label]);

    React.useLayoutEffect(() => {
        if (element.current && element.current.parentElement) {
            const parentElement = element.current.parentElement;
            tooltip.add({
                id: id.current,
                label,
                position,
                margin,
                parent: parentElement,
            });

            parentElement.addEventListener('mouseenter', onMouseEnter);
            parentElement.addEventListener('mouseleave', onMouseLeave);
            parentElement.addEventListener('focusin', onFocusIn);
            parentElement.addEventListener('focusout', onFocusOut);
        }

        return () => {
            if (element.current && element.current.parentElement) {
                const parentElement = element.current.parentElement;
                parentElement.removeEventListener('mouseenter', onMouseEnter);
                parentElement.removeEventListener('mouseleave', onMouseLeave);
                parentElement.removeEventListener('focusin', onFocusIn);
                parentElement.removeEventListener('focusout', onFocusOut);

                tooltip.remove(id.current);
            }
        };
    }, []);

    return (
        <div ref={element} className={styles['tooltip-placeholder']} />
    );
};

Tooltip.propTypes = {
    label: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    margin: PropTypes.number,
};

module.exports = Tooltip;
