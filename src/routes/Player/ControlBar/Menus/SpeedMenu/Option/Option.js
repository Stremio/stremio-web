// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button } = require('stremio/common');
const styles = require('./styles');

const OptionButton = ({ className, value, selected, onSelect }) => {
    const onClick = React.useCallback(() => {
        if (typeof onSelect === 'function') {
            onSelect(value);
        }
    }, [onSelect, value]);
    return (
        <Button
            className={classnames(className, styles['option'], { 'selected': selected })}
            onClick={onClick}
        >
            <div className={styles['label']}>{ value }x</div>
            <div className={styles['icon']} />
        </Button>
    );
};

OptionButton.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
};

module.exports = OptionButton;
