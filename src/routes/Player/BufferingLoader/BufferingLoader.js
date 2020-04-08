// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Image } = require('stremio/common');
const styles = require('./styles');

const BufferingLoader = ({ className, logo }) => {
    return (
        <div className={classnames(className, styles['buffering-loader-container'])}>
            <Image
                className={styles['buffering-loader']}
                src={logo}
                alt={' '}
                fallbackSrc={'/images/stremio_symbol.png'}
            />
        </div>
    );
};

BufferingLoader.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string
};

module.exports = BufferingLoader;
