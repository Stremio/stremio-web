const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Image } = require('stremio/common');
const styles = require('./styles');

const BufferingLoader = ({ className, logo, progress }) => {
    const hasProgress = progress !== null && !isNaN(progress) && progress > 0;
    return (
        <div className={classnames(className, styles['buffering-loader-container'])}>
            <Image
                className={classnames(styles['buffering-loader'], hasProgress || styles['loader-animation'])}
                src={logo}
                alt={' '}
                fallbackSrc={'/images/stremio_symbol.png'}
                style={{ WebkitMaskImage: hasProgress ? `-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(0,0,0,1)), color-stop(${progress}%,rgba(0,0,0,1)), color-stop(${progress + 2}%,rgba(0,0,0,0.1)), color-stop(100%,rgba(0,0,0,0.1)))` : 'none' }}
            />
        </div>
    );
};

BufferingLoader.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string,
    progress: PropTypes.number
};

module.exports = BufferingLoader;
