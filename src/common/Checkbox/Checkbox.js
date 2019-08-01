const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const Checkbox = React.forwardRef(({ className, checked = false, disabled = false, onClick, children }, ref) => {
    return (
        <div className={classnames(className, styles['checkbox-container'], { 'checked': checked }, { 'disabled': disabled })} onClick={onClick}>
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
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node
};

module.exports = Checkbox;
