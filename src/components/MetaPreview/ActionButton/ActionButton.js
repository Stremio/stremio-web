// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/components');
const styles = require('./styles');
const { Tooltip } = require('stremio/common/Tooltips');

const ActionButton = ({ className, icon, label, tooltip, ...props }) => {
    const labelText = typeof label === 'string' ? label : '';
    const hasLabel = !tooltip && label != null;
    const wide = !tooltip && (typeof label === 'string' || React.isValidElement(label));

    return (
        <Button title={tooltip ? '' : labelText} {...props} className={classnames(className, styles['action-button-container'], { 'wide': wide })}>
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
                hasLabel ?
                    <div className={styles['label-container']}>
                        {/* render label (string or node) directly */}
                        <div className={styles['label']}>{label}</div>
                    </div>
                    :
                    null
            }
        </Button>
    );
};

ActionButton.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tooltip: PropTypes.bool
};

module.exports = ActionButton;
