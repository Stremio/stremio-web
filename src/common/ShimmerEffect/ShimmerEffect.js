const React = require('react');
const classnames = require('classnames');
const styles = require('./styles');

const ShimmerEffect = ({ className, ...props }) => {
    return <div className={classnames(className, styles['shimmer'])} {...props}/>;
};

module.exports = ShimmerEffect;