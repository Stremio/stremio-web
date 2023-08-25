// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const Checkbox = React.forwardRef(({ className, checked, children, ...props }, ref) => {
    return (
        <Button {...props} ref={ref} className={classnames(className, styles['checkbox-container'], { 'checked': checked })}>
            <div className={styles['toggle']} />
            {children}
        </Button>
    );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    children: PropTypes.node
};

module.exports = Checkbox;
