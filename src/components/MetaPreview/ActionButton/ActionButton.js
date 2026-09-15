// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/components');
const styles = require('./styles');
const { Tooltip } = require('stremio/common/Tooltips');

/** @typedef {Partial<React.ComponentProps<typeof Button>> & { icon?: string, label?: string, tooltip?: boolean, variant?: 'icon' | 'wide' }} Props */

const ActionButton = React.forwardRef(/** @param {Props} props */ ({ className, icon, label, tooltip = false, variant, ...props }, ref) => {
    const wide = variant === 'wide' || (variant !== 'icon' && typeof label === 'string' && !tooltip);
    return (
        <Button ref={ref} title={tooltip ? '' : label} aria-label={label} {...props} className={classnames(className, styles['action-button-container'], { [styles['wide']]: wide })}>
            {
                tooltip === true ?
                    <Tooltip label={label} position={'top'} />
                    :
                    null
            }
            {
                typeof icon === 'string' && icon.length > 0 ?
                    <div className={styles['icon-container']}>
                        <Icon className={styles['icon']} name={icon} />
                    </div>
                    :
                    null
            }
            {
                !tooltip && typeof label === 'string' && label.length > 0 ?
                    <div className={styles['label-container']}>
                        <div className={styles['label']}>{label}</div>
                    </div>
                    :
                    null
            }
            {props.children}
        </Button>
    );
});

ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    tooltip: PropTypes.bool,
    variant: PropTypes.oneOf(['icon', 'wide']),
    children: PropTypes.node
};

module.exports = ActionButton;
