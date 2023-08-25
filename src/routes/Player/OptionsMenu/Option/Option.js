// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/common');
const styles = require('./styles');

const Option = ({ icon, label, deviceId, disabled, onClick }) => {
    const onButtonClick = React.useCallback(() => {
        if (typeof onClick === 'function') {
            onClick(deviceId);
        }
    }, [onClick, deviceId]);
    return (
        <Button className={classnames(styles['option-container'], { 'disabled': disabled })} disabled={disabled} onClick={onButtonClick}>
            <Icon className={styles['icon']} name={icon} />
            <div className={styles['label']}>{ label }</div>
        </Button>
    );
};

Option.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string,
    deviceId: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

module.exports = Option;
