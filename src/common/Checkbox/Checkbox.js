const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const Checkbox = React.forwardRef((props, ref) => {
    return (
        <Button {...props} ref={ref} className={classnames(props.className, styles['checkbox-container'], { 'checked': props.checked })}>
            <div className={styles['icon-container']}>
                <Icon className={styles['icon']} icon={props.checked ? 'ic_check' : 'ic_box_empty'} />
            </div>
            {props.children}
        </Button>
    );
});

Checkbox.displayName = 'Checkbox';

module.exports = Checkbox;
