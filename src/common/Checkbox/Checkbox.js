const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const Checkbox = React.forwardRef((props, ref) => {
    const onClick = React.useCallback((event) => {
        event.preventDefault();
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }
    }, [props.onClick]);
    const onDrag = React.useCallback((event) => {
        if (typeof props.onDrag === 'function') {
            props.onDrag(event);
        }

        if (!event.defaultPrevented) {
            event.currentTarget.firstChild.blur();
        }
    }, [props.onDrag]);
    const onMouseOut = React.useCallback((event) => {
        if (typeof props.onMouseOut === 'function') {
            props.onMouseOut(event);
        }

        if (!event.defaultPrevented) {
            event.currentTarget.firstChild.blur();
        }
    }, [props.onMouseOut]);
    return (
        <label className={classnames(props.className, styles['checkbox-container'], { 'checked': props.checked }, { 'disabled': props.disabled })} onClick={onClick} onDrag={onDrag} onMouseOut={onMouseOut}>
            <Input
                ref={ref}
                className={styles['native-checkbox']}
                type={'checkbox'}
                disabled={props.disabled}
                defaultChecked={props.checked}
            />
            <Icon className={styles['icon']} icon={props.checked ? 'ic_check' : 'ic_box_empty'} />
            {React.Children.only(props.children)}
        </label>
    );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    onDrag: PropTypes.func,
    onMouseOut: PropTypes.func
};

Checkbox.defaultProps = {
    disabled: false,
    checked: false
};

module.exports = Checkbox;
