const React = require('react');
const PropTypes = require('prop-types');

const Image = ({ className, src, alt, fallbackSrc, renderFallback }) => {
    const [broken, setBroken] = React.useState(false);
    const onError = React.useCallback(() => {
        setBroken(true);
    }, []);
    React.useLayoutEffect(() => {
        setBroken(false);
    }, [src]);
    return (broken || typeof src !== 'string' || src.length === 0) && (typeof renderFallback === 'function' || typeof fallbackSrc === 'string') ?
        typeof renderFallback === 'function' ?
            renderFallback()
            :
            <img className={className} src={fallbackSrc} alt={alt} />
        :
        <img className={className} src={src} alt={alt} onError={onError} />;
};

Image.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    fallbackSrc: PropTypes.string,
    renderFallback: PropTypes.func
};

module.exports = Image;
