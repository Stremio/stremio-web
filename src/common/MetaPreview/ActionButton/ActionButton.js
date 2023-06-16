// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const ActionButton = ({ className, icon, label, ...props }) => {
    return (
        <Button title={label} {...props} className={classnames(className, styles['action-button-container'])}>
            {
                typeof icon === 'string' && icon.length > 0 ?
                    <div className={styles['icon-container']}>
                        <Icon className={styles['icon']} icon={icon} />
                    </div>
                    :
                    null
            }
            {
                typeof label === 'string' && label.length > 0 ?
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
    label: PropTypes.string
};

module.exports = ActionButton;
