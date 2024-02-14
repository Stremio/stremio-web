// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/common');
const styles = require('./styles');

const DiscreteSelectInput = ({ className, value, label, disabled, dataset, onChange }) => {
    const buttonOnClick = React.useCallback((event) => {
        if (typeof onChange === 'function') {
            onChange({
                type: 'change',
                value: event.currentTarget.dataset.type,
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [dataset, onChange]);
    return (
        <div className={classnames(className, styles['discrete-input-container'], { 'disabled': disabled })}>
            <div className={styles['header']}>{label}</div>
            <div className={styles['input-container']} title={disabled ? `${label} is not configurable` : null}>
                <Button className={classnames(styles['button-container'], { 'disabled': disabled })} data-type={'decrement'} onClick={buttonOnClick}>
                    <Icon className={styles['icon']} name={'remove'} />
                </Button>
                <div className={styles['option-label']} title={value}>{value}</div>
                <Button className={classnames(styles['button-container'], { 'disabled': disabled })} data-type={'increment'} onClick={buttonOnClick}>
                    <Icon className={styles['icon']} name={'add'} />
                </Button>
            </div>
        </div>
    );
};

DiscreteSelectInput.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    onChange: PropTypes.func
};

module.exports = DiscreteSelectInput;
