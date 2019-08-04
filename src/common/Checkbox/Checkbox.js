const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('../Button');
const styles = require('./styles');

const Checkbox = React.forwardRef(({ className, checked = false, disabled = false, onClick, children }, ref) => {
    return (
        <Button ref={ref} className={classnames(className, styles['checkbox-container'], { 'checked': checked })} disabled={disabled} onClick={onClick}>
            <Icon className={styles['icon']} icon={checked ? 'ic_check' : 'ic_box_empty'} />
            {React.isValidElement(children) ? children : null}
        </Button>
    );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Checkbox;
