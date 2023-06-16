// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const styles = require('./styles');

const PlayIconCircleCentered = ({ className }) => {
    return (
        <svg className={className} viewBox={'0 0 100 100'}>
            <circle className={styles['background']} cx={'50'} cy={'50'} r={'50'} />
            <svg className={styles['icon']} x={'0'} y={'25'} width={'100'} height={'50'} viewBox={'0 0 37.14 32'}>
                <path d={'M 9.14,0 37.14,16 9.14,32 Z'} />
            </svg>
        </svg>
    );
};

PlayIconCircleCentered.propTypes = {
    className: PropTypes.string
};

module.exports = PlayIconCircleCentered;
