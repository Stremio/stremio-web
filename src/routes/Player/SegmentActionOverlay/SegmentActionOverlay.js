// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/components');
const styles = require('./styles');

const SegmentActionOverlay = ({ className, label, onAction }) => {
    const onClick = React.useCallback(() => {
        if (typeof onAction === 'function') {
            onAction();
        }
    }, [onAction]);

    return (
        <div className={classnames(className, styles['segment-action-overlay'])}>
            <Button className={styles['action-button']} onClick={onClick}>
                <Icon className={styles['icon']} name={'next'} />
                <span className={styles['label']}>{label}</span>
            </Button>
        </div>
    );
};

SegmentActionOverlay.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onAction: PropTypes.func.isRequired,
};

module.exports = SegmentActionOverlay;
