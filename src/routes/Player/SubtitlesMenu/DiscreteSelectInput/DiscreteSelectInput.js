const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
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
                    <Icon className={styles['icon']} icon={'ic_minus'} />
                </Button>
                <div className={styles['option-label']} title={value}>{value}</div>
                <Button className={classnames(styles['button-container'], { 'disabled': disabled })} data-type={'increment'} onClick={buttonOnClick}>
                    <Icon className={styles['icon']} icon={'ic_plus'} />
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
