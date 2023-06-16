// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');

const Image = ({ className, src, alt, fallbackSrc, renderFallback, ...props }) => {
    const [broken, setBroken] = React.useState(false);
    const onError = React.useCallback((event) => {
        if (typeof props.onError === 'function') {
            props.onError(event);
        }

        setBroken(true);
    }, [props.onError]);
    React.useLayoutEffect(() => {
        setBroken(false);
    }, [src]);
    return (broken || typeof src !== 'string' || src.length === 0) && (typeof renderFallback === 'function' || typeof fallbackSrc === 'string') ?
        typeof renderFallback === 'function' ?
            renderFallback()
            :
            <img {...props} className={className} src={fallbackSrc} alt={alt} />
        :
        <img {...props} className={className} src={src} alt={alt} onError={onError} />;
};

Image.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    fallbackSrc: PropTypes.string,
    renderFallback: PropTypes.func,
    onError: PropTypes.func
};

module.exports = Image;
