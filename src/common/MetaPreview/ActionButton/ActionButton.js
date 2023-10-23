// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const Button = require('stremio/common/Button');
const styles = require('./styles');
const { Tooltip } = require('stremio/common/Tooltips');

const ActionButton = ({ className, icon, label, tooltip, ...props }) => {
    return (
        <Button title={tooltip ? '' : label} {...props} className={classnames(className, styles['action-button-container'], { 'wide': typeof label === 'string' && !tooltip })}>
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
        </Button>
    );
};

ActionButton.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    tooltip: PropTypes.bool
};

module.exports = ActionButton;
