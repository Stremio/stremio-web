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

    const onMouseEnter = () => {
        tooltip.update(id.current, {
            active: true,
        });
    };

    const onMouseLeave = () => {
        tooltip.update(id.current, {
            active: false,
        });
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
        }

        return () => {
            if (element.current && element.current.parentElement) {
                const parentElement = element.current.parentElement;
                parentElement.removeEventListener('mouseenter', onMouseEnter);
                parentElement.removeEventListener('mouseleave', onMouseLeave);

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
