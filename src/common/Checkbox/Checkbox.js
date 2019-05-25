const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const Checkbox = React.forwardRef(({ className, disabled = false, checked = false, children, ...props }, ref) => {
    const onClick = React.useCallback((event) => {
        event.preventDefault();
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }
    }, [props.onClick]);
    const onMouseDown = React.useCallback((event) => {
        if (typeof props.onMouseDown === 'function') {
            props.onMouseDown(event);
        }

        if (!event.defaultPrevented) {
            event.currentTarget.firstChild.blur();
        }
    }, [props.onMouseDown]);
    const onMouseMove = React.useCallback((event) => {
        if (typeof props.onMouseMove === 'function') {
            props.onMouseMove(event);
        }

        if (!event.defaultPrevented) {
            event.currentTarget.firstChild.blur();
        }
    }, [props.onMouseMove]);
    return (
        <label className={classnames(className, styles['checkbox-container'], { 'checked': checked }, { 'disabled': disabled })} {...props} onClick={onClick} onMouseDown={onMouseDown} onMouseMove={onMouseMove}>
            <Input
                ref={ref}
                className={styles['native-checkbox']}
                type={'checkbox'}
                disabled={disabled}
                checked={checked}
                readOnly={true}
            />
            <Icon className={styles['icon']} icon={checked ? 'ic_check' : 'ic_box_empty'} />
            {React.isValidElement(React.Children.only(children)) ? children : null}
        </label>
    );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseMove: PropTypes.func,
    children: PropTypes.node
};

module.exports = Checkbox;
