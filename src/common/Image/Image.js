const React = require('react');
const PropTypes = require('prop-types');
const styles = require('./styles');

const Image = ({ className, src, alt, fallbackSrc, renderFallback }) => {
    const [broken, setBroken] = React.useState(false);
    const onError = React.useCallback((event) => {
        if (typeof src !== 'string' || event.currentTarget.src === src) {
            setBroken(true);
        }
    }, [src]);
    React.useLayoutEffect(() => {
        setBroken(false);
    }, [src]);
    return (
        <div className={className}>
            {
                (broken || typeof src !== 'string' || src.length === 0) && (typeof renderFallback === 'function' || typeof fallbackSrc === 'string') ?
                    typeof renderFallback === 'function' ?
                        renderFallback()
                        :
                        <img className={styles['fallback-image']} src={fallbackSrc} alt={alt} />
                    :
                    <img className={styles['image']} src={src} alt={alt} onError={onError} />
            }
        </div>
    );
};

Image.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    renderFallback: PropTypes.func
};

module.exports = Image;
