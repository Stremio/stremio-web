// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button } = require('stremio/common');
const styles = require('./styles');

const Option = ({ icon, label, playerId, disabled, onClick }) => {
    const onButtonClick = React.useCallback(() => {
        if (typeof onClick === 'function') {
            onClick(playerId);
        }
    }, [onClick, playerId]);
    return (
        <Button className={classnames(styles['option-container'], { 'disabled': disabled })} disabled={disabled} onClick={onButtonClick}>
            <Icon className={styles['icon']} icon={icon} />
            <div className={styles['label']}>{ label }</div>
        </Button>
    );
};

Option.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string,
    playerId: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

module.exports = Option;
