// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const Checkbox = React.forwardRef(({ className, checked, children, ...props }, ref) => {
    return (
        <Button {...props} ref={ref} className={classnames(className, styles['checkbox-container'], { 'checked': checked })}>
            {
                checked ?
                    <svg className={styles['icon']} viewBox={'0 0 100 100'}>
                        <Icon x={'10'} y={'10'} width={'80'} height={'80'} icon={'ic_check'} />
                    </svg>
                    :
                    <Icon className={styles['icon']} icon={'ic_box_empty'} />
            }
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
