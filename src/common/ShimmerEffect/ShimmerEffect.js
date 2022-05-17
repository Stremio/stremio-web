const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useAnimationSync } = require('stremio/common/AnimationSync');
const styles = require('./styles');

const ShimmerEffect = ({ className, ...props }) => {
    const { register, unregister } = useAnimationSync();
    const effectRef = React.useRef(null);
    React.useLayoutEffect(() => {
        if (effectRef.current !== null) {
            register('shimmer', effectRef.current);
            return () => unregister('shimmer', effectRef.current);
        }
    }, []);
    return (
        <div className={classnames(className, styles['shimmer'])} {...props}>
            <div ref={effectRef} className={styles['effect']}/>
        </div>
    );
};

ShimmerEffect.propTypes = {
    className: PropTypes.string,
};

module.exports = ShimmerEffect;
