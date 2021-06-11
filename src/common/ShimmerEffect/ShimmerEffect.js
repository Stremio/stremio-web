const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const ShimmerEffect = ({ className, ...props }) => {
    return <div className={classnames(className, styles['shimmer'])} {...props}/>;
};

ShimmerEffect.propTypes = {
    className: PropTypes.string,
};

module.exports = ShimmerEffect;
