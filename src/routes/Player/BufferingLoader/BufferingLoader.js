// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Image } = require('stremio/components');
const styles = require('./styles');

const BufferingLoader = React.forwardRef(({ className, logo }, ref) => {
    return (
        <div ref={ref} className={classnames(className, styles['buffering-loader-container'])}>
            <Image
                className={styles['buffering-loader']}
                src={logo}
                alt={' '}
                fallbackSrc={require('/assets/images/stremio_symbol.png')}
            />
        </div>
    );
});

BufferingLoader.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string,
};

module.exports = BufferingLoader;
